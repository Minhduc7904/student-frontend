import assert from "node:assert/strict";
import test from "node:test";

import { SocketService } from "../src/core/services/socket/socket.service.js";

class FakeSocket {
  constructor() {
    this.connected = false;
    this.connectCalls = 0;
    this.handlers = new Map();
    this.io = { reconnection: () => {} };
  }

  on(event, callback) {
    let callbacks = this.handlers.get(event);
    if (!callbacks) {
      callbacks = new Set();
      this.handlers.set(event, callbacks);
    }
    callbacks.add(callback);
    return this;
  }

  off(event, callback) {
    const callbacks = this.handlers.get(event);
    if (!callbacks) return this;
    callbacks.delete(callback);
    if (callbacks.size === 0) this.handlers.delete(event);
    return this;
  }

  emitEvent(event, payload) {
    for (const callback of this.handlers.get(event) ?? []) callback(payload);
  }

  disconnect() {
    this.connected = false;
  }

  connect() {
    this.connectCalls += 1;
    this.connected = true;
  }

  listenerCount(event) {
    return this.handlers.get(event)?.size ?? 0;
  }
}

const createService = () => {
  const sockets = [];
  const service = new SocketService(() => {
    const socket = new FakeSocket();
    sockets.push(socket);
    return socket;
  });
  return { service, sockets };
};

test("keeps pending subscriptions and supports multiple listeners per event", () => {
  const { service, sockets } = createService();
  const received = [];
  const first = (payload) => received.push(["first", payload]);
  const second = (payload) => received.push(["second", payload]);

  service.on("notification:new", first);
  service.on("notification:new", second);
  service.connect("token");

  assert.equal(sockets[0].listenerCount("notification:new"), 2);
  sockets[0].emitEvent("notification:new", { notificationId: 1 });
  assert.deepEqual(received, [
    ["first", { notificationId: 1 }],
    ["second", { notificationId: 1 }],
  ]);
});

test("unsubscribe removes only its own callback", () => {
  const { service, sockets } = createService();
  const first = () => {};
  const second = () => {};

  const unsubscribeFirst = service.on("notification:new", first);
  service.on("notification:new", second);
  service.connect("token");
  unsubscribeFirst();

  assert.equal(sockets[0].listenerCount("notification:new"), 1);
  assert.equal(sockets[0].handlers.get("notification:new").has(second), true);
});

test("reattaches registered listeners when token refresh recreates the socket", () => {
  const { service, sockets } = createService();
  const listener = () => {};

  service.on("notification:new", listener);
  service.connect("old-token");
  service.reconnectWithToken("new-token");

  assert.equal(sockets.length, 2);
  assert.equal(sockets[1].listenerCount("notification:new"), 1);
  assert.equal(sockets[1].handlers.get("notification:new").has(listener), true);
});

test("keeps subscriptions across logout disconnect until they are explicitly removed", () => {
  const { service, sockets } = createService();
  const listener = () => {};

  const unsubscribe = service.on("notification:new", listener);
  service.connect("token");
  service.disconnect();
  service.connect("new-token");

  assert.equal(sockets[1].listenerCount("notification:new"), 1);
  unsubscribe();
  assert.equal(sockets[1].listenerCount("notification:new"), 0);
});

test("marks server auth errors and does not reconnect with the stale token", () => {
  const { service, sockets } = createService();
  service.connect("expired-token");

  sockets[0].emitEvent("error", { message: "Authentication failed" });
  sockets[0].emitEvent("disconnect", "io server disconnect");

  assert.equal(service.getAuthFailed(), true);
  assert.equal(sockets[0].connectCalls, 0);
});

test("does not treat feature errors as socket auth failures", () => {
  const { service, sockets } = createService();
  service.connect("token");

  sockets[0].emitEvent("error", {
    code: "INVALID_PAYMENT_INTENT_ID",
    message: "Invalid payment intent ID",
  });
  sockets[0].emitEvent("disconnect", "io server disconnect");

  assert.equal(service.getAuthFailed(), false);
  assert.equal(sockets[0].connectCalls, 1);
});

test("does not create duplicate sockets while the first connection is pending", () => {
  const { service, sockets } = createService();

  service.connect("token");
  service.connect("token");

  assert.equal(sockets.length, 1);
});
