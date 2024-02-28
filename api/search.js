async function searchRoutes(fastify, options) {
    /**
     * @noCustomerSearch
     * @param searchingString
     * @returns trc_division, trc_item, trc_amount, trc_payment, trc_detail, trc_sysdate
     */
    fastify.get('/api/search/customer/no/:searchingString', async(request, reply) => {
        const data = `%${ request.params.searchingString }%`;

        const connection = await fastify.mysql.getConnection();

        const noCustomerSearchingResult = await fastify.mysql.query(
            fastify.queryManager.selectSearchNotCustomer,
            [data, data, data]
        );

        connection.release();

        reply.send({
            ok: true,
            message: noCustomerSearchingResult
        });
    });
}

module.exports = searchRoutes;