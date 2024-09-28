module.exports.paginationAggregate = async function ($model, $aggregate, $extra) {
    const data = { data: [], extra: {} };

    data.extra = {
        page: $extra.page * 1 > 0 ? $extra.page * 1 : 1,
        limit: $extra.limit * 1 > 0 ? $extra.limit * 1 : 20,
        total: 0,
    };

    try {
        const counter = await $model.aggregate([...$aggregate, { $count: "total" }]);
        data.extra.total = counter[0]?.total;
        if ($extra.isAll) {
            data.extra.page = 1;
            data.extra.limit = data.extra.total;
        }
        data.extra.total = counter[0]?.total;
        if ($extra.isAll) {
            data.extra.page = 1;
            data.extra.limit = data.extra.total || 100;
        }

        data.data = await $model.aggregate(
            [
                ...$aggregate,
                { $limit: data.extra.limit + data.extra.limit * (data.extra.page - 1) },
                { $skip: data.extra.limit * (data.extra.page - 1) }
            ]);

        return data;
    } catch (err) {
        throw err;
    }
}