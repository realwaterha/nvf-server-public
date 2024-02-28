async function customerRoutes(fastify, options) {
    /**
     * @customerInfo
     * @param cm_index
     * @returns cm_index, cm_name, cm_phone, cm_car, cm_car_number, cm_detail,
     *          cm_sysdate
     */
    fastify.get('/api/customer/info/:index', async(request, reply) => {
        const data = request.params.index;

        const connection = await fastify.mysql.getConnection();

        const customerInfo = await fastify.mysql.query(
            fastify.queryManager.selectCustomerInfo,
            [data]
        );

        connection.release();

        reply.send({
            ok: true,
            massage: customerInfo
        });
    });

    /**
     * @customerSearching
     * @param searchingString
     * @returns cm_index, cm_name, cm_phone, cm_car, cm_car_number
     */
    fastify.get('/api/customer/search/:searchingString', async(request, reply) => {
        const data = `%${ request.params.searchingString }%`;

        const connection = await fastify.mysql.getConnection();
    
        const customerSimpleInfo = await fastify.mysql.query(
            fastify.queryManager.selectCustomerSearching,
            [data, data, data, data]
        );
    
        connection.release();

        reply.send({
            ok: true,
            message: customerSimpleInfo
        });
    });

    /**
     * @customerCheck
     * @params cm_name, cm_phone
     * @return cm_name
     */
    fastify.post('/api/customer/check', async(request, reply) => {
        const data = request.body;

        const cmIndex = fastify.crypto.createHash('sha256')
                        .update(data.cm_name+data.cm_phone).digest('hex');

        const connection = await fastify.mysql.getConnection();

        const customerCheck = await fastify.mysql.query(
            fastify.queryManager.selectCustomerCheck,
            [cmIndex]
        );

        connection.release();

        reply.send({
            ok: true,
            message: customerCheck
        });
    });

    /**
     * @newCustomer
     * @field cm_index, cm_name, cm_phone, cm_car, cm_car_number, cm_detail
     * @params cm_name, cm_phone, cm_car, cm_car_number, cm_detail
     */
    fastify.post('/api/customer/new', async(request, reply) => {
        const data = request.body;

        const cmIndex = fastify.crypto.createHash('sha256')
                        .update(data.cm_name+data.cm_phone).digest('hex');

        const connection = await fastify.mysql.getConnection();

        await fastify.mysql.query(
            fastify.queryManager.insertCustomer,
            [
                cmIndex, data.cm_name, data.cm_phone, data.cm_car, data.cm_car_number,
                data.cm_detail
            ]
        );

        connection.release();

        reply.send({ ok: true });
    });

    /**
     * @customerUpdateInfo
     * @params cm_index, cm_name, cm_phone, cm_car, cm_car_number
     * @return cm_index
     */
    fastify.put('/api/customer/update/:index', async(request, reply) => {
        const data = {
            index: request.params.index,
            params: request.body
        }

        const cmIndex = fastify.crypto.createHash('sha256')
                        .update(data.params.cm_name+data.params.cm_phone)
                        .digest('hex');

        const connection = await fastify.mysql.getConnection();

        await fastify.mysql.query(
            fastify.queryManager.updateCustomer,
            [
                cmIndex, data.params.cm_name, data.params.cm_phone,
                data.params.cm_car, data.params.cm_car_number, data.index
            ]
        );

        connection.release();

        reply.send({
            ok: true,
            message: cmIndex
        });
    });
}

module.exports = customerRoutes;