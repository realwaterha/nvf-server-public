async function tradeRoutes(fastify, options) {
    /**
     * @latestInsertItems
     * @returns divisions, items
     */
    fastify.get('/api/trade/items/latest', async(request, reply) => {
        const connection = await fastify.mysql.getConnection();

        const data = await fastify.mysql.query(
            fastify.queryManager.selectLatestInsertItems
        );

        connection.release();

        reply.send({ 
            ok: true,
            message: [{
                divisions: data[0][0].divisions,
                items: data[0][0].items
            }]
        });
    });

    /**
     * @newTrade
     * @field_trade trc_index, cm_index, trc_cm_name, trc_division, trc_item, 
     *              trc_amount, trc_payment, trc_detail
     * @field_transaction trtran_index, trc_index, trtran_payment, trtran_amount
     * @params trc_division, trc_item, trc_cm_name, cm_phone, trc_amount,
     *         trc_payment, trc_detail
     */
    fastify.post('/api/trade/new', async(request, reply) => {
        const data = request.body;
 
        const cmIndex = fastify.crypto.createHash('sha256')
                        .update(data.trc_cm_name+data.cm_phone).digest('hex');
        const trcIndex = fastify.crypto.createHash('sha256')
                        .update(data.trc_cm_name+data.cm_phone+new Date())
                        .digest('hex');
        const trtranIndex = fastify.crypto.createHash('sha256')
                        .update(trcIndex+data.trc_cm_name).digest('hex');
                 
        const connection = await fastify.mysql.getConnection();

        await fastify.mysql.query(
            fastify.queryManager.insertNewTrade,
            [
                trcIndex, cmIndex, data.trc_cm_name, data.trc_division,
                data.trc_item, data.trc_amount, data.trc_payment, data.trc_detail
            ]
        );

        await fastify.mysql.query(
            fastify.queryManager.insertNewTransaction,
            [
                trtranIndex, trcIndex, data.trc_payment, data.trc_amount
            ]
        );

        connection.release();

        reply.send({ ok: true });
    });

    /**
     * @updateTrade
     * @params trc_index, trc_division, trc_item, trc_amount, trc_payment, trc_detail
     */
    fastify.put('/api/trade/update/:index', async(request, reply) => {
        const data = {
            index: request.params.index,
            params: request.body
        }

        const connection = await fastify.mysql.getConnection();

        await fastify.mysql.query(
            fastify.queryManager.updateTrade,
            [
                data.params.trc_division, data.params.trc_item, data.params.trc_amount,
                data.params.trc_payment, data.params.trc_detail, data.index
            ]
        );

        await fastify.mysql.query(
            fastify.queryManager.updateTradeTransaction,
            [
                data.params.trc_payment, data.params.trc_amount, data.index
            ]
        )

        connection.release();

        reply.send({ ok: true });
    });

    /**
     * @deleteTrade
     * @param trc_index
     */
    fastify.delete('/api/trade/delete/:index', async(request, reply) => {
        const data = request.params.index;

        const connection = await fastify.mysql.getConnection();

        await fastify.mysql.query(
            fastify.queryManager.deleteTrade,
            [data]
        );

        connection.release();

        reply.send({ ok: true });
    });
}

module.exports = tradeRoutes;