export const getStartAndEndOfDay = (date: Date) => {
    const now = new Date(date);

    const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0, 0
    ).getTime();

    const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59, 999
    ).getTime();

    return { startOfToday, endOfToday };
}