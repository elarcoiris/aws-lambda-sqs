exports.handler = async (event, context) => {
    try {
        console.log(event);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Event successfully processed',
            })
        }
    } catch (error) {
        console.log(error);
        return error;
    }

    return response;
};