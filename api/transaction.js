async function transactionRoutes(fastify, options) {
    /**
     * @allTradeTransaction
     * @returns trc_index, trc_sysdate, trc_division, trc_cm_name, trc_amount,
     *          trc_payment, trc_detail
     */
    fastify.get('/api/trade/transaction/all', async(request, reply) => {
        const connection = await fastify.mysql.getConnection();

        const allTradeTransaction = await fastify.mysql.query(
            fastify.queryManager.selectAllTradeTransaction
        );

        connection.release();

        reply.send({
            ok: true,
            message: allTradeTransaction
        });
    });

    /**
     * @latestTradeTransaction
     * @returns trc_index, trc_sysdate, trc_division, trc_cm_name, trc_amount,
     *          trc_payment, trc_detail
     */
    fastify.get('/api/trade/transaction/latest', async(request, reply) => {
        const connection = await fastify.mysql.getConnection();

        const latestTradeTransaction = await fastify.mysql.query(
            fastify.queryManager.selectLatestTradeTransaction
        );

        connection.release();

        reply.send({
            ok: true,
            message: latestTradeTransaction
        });
    });

    /**
     * @customerAllTradeTransaction
     * @param cm_index
     * @returns trc_index, trc_sysdate, trc_division, trc_item, trc_amount,
     *          trc_payment, trc_detail
     */
    fastify.get('/api/trade/transaction/customer/all/:index', 
    async(request, reply) => {
        const data = request.params.index;

        const connection = await fastify.mysql.getConnection();

        const customerAllTradeTransaction = await fastify.mysql.query(
            fastify.queryManager.selectAllCustomerTradeTransaction,
            [data]
        );

        connection.release();

        reply.send({
            ok: true,
            message: customerAllTradeTransaction
        });
    });

    /**
     * @customerLatestTradeTransaction
     * @param cm_index
     * @returns trc_index, trc_sysdate, trc_division, trc_item, trc_amount,
     *          trc_payment, trc_detail
     */
    fastify.get('/api/trade/transaction/customer/latest/:index', 
    async(request, reply) => {
        const data = request.params.index;
    
        const connection = await fastify.mysql.getConnection();
    
        const customerLatestTradeTransaction = await fastify.mysql.query(
            fastify.queryManager.selectLatestCustomerTradeTransaction,
            [data]
        );
    
        connection.release();
    
        reply.send({
            ok: true,
            message: customerLatestTradeTransaction
        });
    });
}

module.exports = transactionRoutes;