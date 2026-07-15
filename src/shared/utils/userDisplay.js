export const getLastNameFirstName = (user, fallback = "") => {
    const name = [user?.lastName, user?.firstName]
        .filter((value) => typeof value === "string" && value.trim())
        .join(" ")
        .trim();

    return name || user?.fullName || fallback;
};
