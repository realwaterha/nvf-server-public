async function salesRoutes(fastify, options) {
    /**
     * @totalSales
     * @return total_sales
     */
    fastify.get('/api/sales/total', async(request, reply) => {
        const connection = await fastify.mysql.getConnection();

        const totalSales = await fastify.mysql.query(
            fastify.queryManager.selectTotalSales
        );

        connection.release();

        reply.send({
            ok: true,
            message: totalSales
        });
    });

    /**
     * @totalGroupSales
     * @returns card_sales, cash_sales, total_sales
     */
    fastify.get('/api/sales/group/total', async(request, reply) => {
        const connection = await fastify.mysql.getConnection();
    
        const totalGroupSales = await fastify.mysql.query(
            fastify.queryManager.selectTotalGroupSales
        );
    
        connection.release();
    
        reply.send({
            ok: true,
            message: totalGroupSales
        });
    });
}

module.exports = salesRoutes;