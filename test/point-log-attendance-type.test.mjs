import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { startViteModuleLoader } from "../test-support/vite-test-server.mjs";

let format;
let item;
let loader;

before(async () => {
  loader = await startViteModuleLoader({
    format: "/src/features/profile/points/pointLogFormat.js",
    item: "/src/features/profile/points/PointLogItem.jsx",
  });
  format = loader.modules.format;
  item = loader.modules.item;
});

after(async () => {
  await loader?.close();
});

const attendanceLog = (metadata, overrides = {}) => ({
  pointLogId: 1,
  type: "BONUS",
  points: 1,
  signedPoints: 1,
  source: "ATTENDANCE",
  referenceType: "ATTENDANCE",
  referenceId: 77,
  createdAt: "2026-10-01T03:00:00.000Z",
  metadata,
  ...overrides,
});

const render = (log) => renderToStaticMarkup(createElement(item.PointLogItem, { log }));

test("REGULAR metadata shows 'Học thường' next to the status", () => {
  const html = render(attendanceLog({ attendanceId: 77, sessionId: 5, status: "PRESENT", attendanceType: "REGULAR" }));

  assert.match(html, /Loại điểm danh/);
  assert.match(html, /Học thường/);
  assert.match(html, /Có mặt/);
  assert.doesNotMatch(html, /Học bù/);
});

test("MAKEUP metadata shows 'Học bù' while the status stays 'Có mặt'", () => {
  const log = attendanceLog({ attendanceId: 77, sessionId: 5, status: "PRESENT", attendanceType: "MAKEUP" });
  const html = render(log);

  assert.match(html, /Loại điểm danh/);
  assert.match(html, /Học bù/);
  assert.match(html, /Có mặt/);
  assert.equal(format.translateNote(log), "Được cộng 1 điểm khi điểm danh: có mặt, học bù.");
});

test("missing attendanceType shows no type, does not crash and does not infer one from the status", () => {
  const log = attendanceLog({ attendanceId: 77, sessionId: 5, status: "PRESENT" });
  const html = render(log);

  assert.doesNotMatch(html, /Loại điểm danh/);
  assert.doesNotMatch(html, /Học bù|Học thường/);
  assert.equal(format.translateNote(log), "Được cộng 1 điểm khi điểm danh: có mặt.");
  assert.equal(format.getAttendanceTypeLabel(undefined), null);
  assert.equal(format.getAttendanceTypeLabel(null), null);
});

test("a log without any metadata renders safely", () => {
  assert.doesNotThrow(() => render(attendanceLog(undefined)));
  assert.doesNotThrow(() => render(attendanceLog(null)));
  assert.doesNotThrow(() => render(attendanceLog("not-an-object")));
});

test("an unknown attendanceType falls back to a safe label instead of the raw value", () => {
  const html = render(attendanceLog({ status: "PRESENT", attendanceType: "SOMETHING_NEW" }));

  assert.match(html, /Không xác định/);
  assert.doesNotMatch(html, /SOMETHING_NEW/);
  assert.equal(format.getAttendanceTypeLabel("constructor"), "Không xác định");
});

test("the attendance type is never inferred from the status", () => {
  const absentMakeup = attendanceLog({ status: "ABSENT", attendanceType: "MAKEUP" }, { type: "PENALTY", signedPoints: -1 });
  const presentRegular = attendanceLog({ status: "PRESENT", attendanceType: "REGULAR" });

  assert.match(render(absentMakeup), /Vắng mặt/);
  assert.match(render(absentMakeup), /Học bù/);
  assert.doesNotMatch(render(presentRegular), /Học bù/);
});

test("the type entry is kept even when there are many metadata keys", () => {
  const entries = format.getMetadataEntries({
    extra1: "a",
    extra2: "b",
    removed: true,
    attendanceId: 1,
    sessionId: 2,
    status: "LATE",
    attendanceType: "MAKEUP",
  });

  assert.deepEqual(
    entries.map(([key]) => key),
    ["attendanceId", "sessionId", "status", "attendanceType"],
  );
});

test("point logs that are not attendance are unaffected", () => {
  const competition = {
    pointLogId: 9,
    type: "BONUS",
    points: 3,
    signedPoints: 3,
    source: "COMPETITION_SUBMIT",
    referenceType: "COMPETITION_SUBMIT",
    referenceId: 12,
    createdAt: "2026-10-01T03:00:00.000Z",
    metadata: { competitionId: 4, competitionSubmitId: 12, status: "PRESENT" },
  };
  const html = render(competition);

  assert.equal(format.translateNote(competition), "Được cộng 3 điểm từ nộp bài cuộc thi.");
  assert.doesNotMatch(html, /Loại điểm danh/);
  assert.match(html, /Mã cuộc thi/);
  assert.match(html, /Nộp bài cuộc thi/);
  assert.equal(format.formatMetadataValue("competitionId", 4), "4");
  assert.equal(format.formatMetadataValue("status", "LATE"), "Đi muộn");
  assert.equal(format.formatMetadataValue("learningItemId", null), "--");
});
