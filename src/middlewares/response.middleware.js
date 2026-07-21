const responseMiddleware = (req, res, next) => {
  res.success = ({
    statusCode = 200,
    message = null,
    data = null,
    meta = null,
  } = {}) => {
    const response = {
      success: true,
    };

    if (message) response.message = message;

    if (data !== null) response.data = data;

    // Note: Added meta - use for pagination
    // {
    //     "success": true,
    //     "data":[...],
    //     "meta":{
    //         "page":1,
    //         "limit":10,
    //         "total":234
    //     }
    // }
    if (meta) response.meta = meta;

    return res.status(statusCode).json(response);
  };

  next();
};

export default responseMiddleware;
