const { portfolioService } = require('../services');
const { success } = require('../utils/response');

const getPortfolio = async (req, res) => {
  success(res, await portfolioService.getPublicPortfolio());
};

module.exports = { getPortfolio };
