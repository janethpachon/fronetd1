USE northwind;
CREATE VIEW vw_products_extended AS
SELECT
    p.ProductID       AS productId,
    p.productname     AS productName,
    p.categoryid      AS categoryId,
    c.categoryname    AS categoryName,
    p.supplierid      AS supplierId,
    s.SupplierName    AS supplierName,
    p.unit            AS quantityPerUnit,
    p.price           AS unitPrice
FROM products   p
JOIN categories c ON p.categoryid = c.categoryid
JOIN suppliers  s ON p.supplierid = s.supplierid;