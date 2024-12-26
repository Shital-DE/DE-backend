// Author : Shital Gayakwad
// Created Date : 18 Oct 2023
// Description : Assembly product structure

const express = require("express");
const properties = require("properties");
const { varifyToken } = require("../../../Middlewares/varify_auth_token");
const { tryCatch } = require("../../../Utils/ErrorHandling/tryCatch");
const { authorizeToken } = require("../../../Middlewares/generate_auth_token");
const { queryPath } = require("../../../Utils/Constants/query.path");
const {
  selectQuery,
  insertQuery,
  deleteQuery,
  updateQuery,
} = require("../../../Utils/file_read");
const AppError = require("../../../Utils/ErrorHandling/appErrors");
const { NOT_FOUND } = require("../../../Utils/Constants/errorCodes");
const productStructure = express.Router();

// All Products list
productStructure.get(
  "/all-products",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[40].AS_PD_PRODUCT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.allProduct, resp);
        }
      );
    }
  })
);

// All Products with revision
productStructure.get(
  "/all-products-with-revisions",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[40].AS_PD_PRODUCT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.allProductsWithRevisions, resp);
        }
      );
    }
  })
);

// Product revision
productStructure.post(
  "/product-revision-list",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[40].AS_PD_PRODUCT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.productRevision.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.product);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// One product data
productStructure.post(
  "/one-product-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[40].AS_PD_PRODUCT,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.oneProductData.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.id);
          query = query.replace(/{revisionno}/g, req.body.revisionno);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Register product structure
productStructure.post(
  "/register-product-structure",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[39].AS_PD_PRODUCT_STRUCTURE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.insertDataQuery.replace(/\n/g, " ");
          query = query.replace(/{createdby}/g, req.body.createdby);
          query = query.replace(/{childproduct_id}/g, req.body.childproduct_id);
          query = query.replace(
            /{parentproduct_id}/g,
            req.body.parentproduct_id
          );
          query = query.replace(/{level}/g, req.body.level);
          query = query.replace(/{producttype}/g, req.body.producttype);
          query = query.replace(/{qty}/g, req.body.qty);
          query = query.replace(/{reorderlevel}/g, req.body.reorderlevel);
          query = query.replace(/{minorderqty}/g, req.body.minorderqty);
          query = query.replace(/{leadtime}/g, req.body.leadtime);
          query = query.replace(/{revisionno}/g, req.body.revisionno);
          insertQuery(query, resp);
        }
      );
    }
  })
);

// Product structure data
productStructure.post(
  "/product-structure-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      if (req.body.id == null || req.body.id == undefined) {
        properties.parse(
          queryPath[39].AS_PD_PRODUCT_STRUCTURE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.selectedProductStructure.replace(/\n/g, " ");
            query = query.replace(
              /{childproduct_id}/g,
              req.body.childproduct_id
            );
            query = query.replace(/{revisionno}/g, req.body.revisionno);
            selectQuery(query, resp);
          }
        );
      } else {
        properties.parse(
          queryPath[39].AS_PD_PRODUCT_STRUCTURE,
          { path: true },
          function (error, data) {
            if (error) {
              throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.selectedProductStructureById.replace(/\n/g, " ");
            query = query.replace(/{id}/g, req.body.id);
            selectQuery(query, resp);
          }
        );
      }
    }
  })
);

// Products childs
productStructure.post(
  "/products-child",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[39].AS_PD_PRODUCT_STRUCTURE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          if (req.body.parentproduct_id == undefined) {
            var query = data.productChilds.replace(/\n/g, " ");
            query = query.replace(/{childproduct_id}/g, req.body.childproduct_id);
            query = query.replace(/{level}/g, req.body.level);
          } else {
            var query = data.productChildsWithParent.replace(/\n/g, " ");
            query = query.replace(/{childproduct_id}/g, req.body.childproduct_id);
            query = query.replace(/{level}/g, req.body.level);
            query = query.replace(/{parentproduct_id}/g, req.body.parentproduct_id);
          }
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Delete item
productStructure.delete(
  "/delete-structure-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[39].AS_PD_PRODUCT_STRUCTURE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.deleteData.replace(/\n/g, " ");
          query = query.replace(/{id}/g, req.body.newid);
          deleteQuery(query, resp);
        }
      );
    }
  })
);

// Product structure presentation
productStructure.post(
  "/product-structure-presentation",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[39].AS_PD_PRODUCT_STRUCTURE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.productStructurePresentation.replace(/\n/g, " ");
          query = query.replace(/{childproduct_id}/g, req.body.id);
          query = query.replace(/{revision_number}/g, req.body.revision_number);
          selectQuery(query, resp);
        }
      );
    }
  })
);

// Update product structure
productStructure.put(
  "/update-structure-data",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[39].AS_PD_PRODUCT_STRUCTURE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          var query = data.updateStructure.replace(/\n/g, " ");
          query = query.replace(/{qty}/g, req.body.qty);
          query = query.replace(/{reorderlevel}/g, req.body.reorderlevel);
          query = query.replace(/{minorderqty}/g, req.body.minorderqty);
          query = query.replace(/{leadtime}/g, req.body.leadtime);
          query = query.replace(/{id}/g, req.body.id);
          updateQuery(query, resp);
        }
      );
    }
  })
);

// Hardware list
productStructure.get(
  "/hardwares",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[39].AS_PD_PRODUCT_STRUCTURE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.hardwarelist, resp);
        }
      );
    }
  })
);

// Consuables lists
productStructure.get(
  "/consumables",
  varifyToken,
  tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
      properties.parse(
        queryPath[39].AS_PD_PRODUCT_STRUCTURE,
        { path: true },
        function (error, data) {
          if (error) {
            throw new AppError(NOT_FOUND, error, 404);
          }
          selectQuery(data.consuambles, resp);
        }
      );
    }
  })
);

// Create product structure history
productStructure.post('/product-structure-history-registration', varifyToken, tryCatch(async (req, resp) => {
  const userData = authorizeToken(req.token);
  if (userData) {
    properties.parse(
      queryPath[50].AS_PD_PRODUCT_STRUCTUREHISTORY,
      { path: true },
      function (error, data) {
        if (error) {
          throw new AppError(NOT_FOUND, error, 404);
        }
        var query = data.insertQuery.replace(/\n/g, " ");
        query = query.replace(/{createdby}/g, req.body.createdby);
        query = query.replace(/{productstructure_id}/g, req.body.productstructure_id);
        query = query.replace(/{quantity}/g, req.body.quantity);
        query = query.replace(/{reorderlevel}/g, req.body.reorderlevel);
        query = query.replace(/{minorderqty}/g, req.body.minorderqty);
        query = query.replace(/{leadtime}/g, req.body.leadtime);
        insertQuery(query, resp);
      }
    );
  }
}))


module.exports = {
  productStructure,
};
