const businessService = require('../services/businessService');
const { sendJson } = require('../utils/http');

function getNearby(req, res) {
  const queryString = req.url.split('?')[1];

  if (!queryString) {
    sendJson(res, 400, {
      message: 'latitude, longitude and radius are required',
    });
    return;
  }

  const params = new URLSearchParams(queryString);

  const latitude = params.get('latitude');
  const longitude = params.get('longitude');
  const radius = params.get('radius') || 5;

  if (!latitude || !longitude) {
    sendJson(res, 400, {
      message: 'latitude and longitude are required',
    });
    return;
  }

  businessService.getNearbyBusinesses(
    latitude,
    longitude,
    radius,
    (error, businesses) => {
      if (error) {
        sendJson(res, 500, {
          message: 'Failed to find nearby businesses',
        });
        return;
      }

      sendJson(res, 200, businesses);
    }
  );
}

function search(req, res) {
  const queryString = req.url.split('?')[1];

  if (!queryString) {
    sendJson(res, 400, {
      message: 'Search term is required',
    });
    return;
  }

  const params = new URLSearchParams(queryString);
  const searchTerm = params.get('search_term');

  if (!searchTerm) {
    sendJson(res, 400, {
      message: 'Search term is required',
    });
    return;
  }

  businessService.searchBusinesses(searchTerm, (error, businesses) => {
    if (error) {
      sendJson(res, 500, {
        message: 'Failed to search businesses',
      });
      return;
    }

    sendJson(res, 200, businesses);
  });
}

function getById(req, res, businessId) {
  businessService.getBusinessById(businessId, (error, business) => {
    if (error) {
      sendJson(res, 500, {
        message: 'Failed to fetch business',
      });
      return;
    }

    if (!business) {
      sendJson(res, 404, {
        message: 'Business not found',
      });
      return;
    }

    sendJson(res, 200, business);
  });
}

function getAll(req, res) {
  const queryString = req.url.split('?')[1];

  let category = null;

  if (queryString) {
    const params = new URLSearchParams(queryString);
    category = params.get('category');
  }

  businessService.getBusinesses(category, (error, businesses) => {
    if (error) {
      sendJson(res, 500, {
        message: 'Failed to fetch businesses',
      });
      return;
    }

    sendJson(res, 200, businesses);
  });
}

module.exports = {
  getNearby,
  search,
  getById,
  getAll,
};
