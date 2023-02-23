let timeHelpers = {
    getMonthForwardTimestamp: () => {
        let date = new Date();
        date.setMonth(d.getMonth() + 1);

        return date.getTime();
    }
};

module.exports = timeHelpers;