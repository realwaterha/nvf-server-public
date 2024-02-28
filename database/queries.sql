-- name: selectCustomerInfo
SELECT 
	cm_index, cm_name, cm_phone, cm_car, cm_car_number, cm_detail,
	cm_sysdate
FROM customer
WHERE cm_index = ?;

-- name: selectAllTradeTransaction
SELECT
	trc_index, trc_sysdate, trc_division, trc_item, trc_cm_name, trc_amount,
	trc_payment, trc_detail
FROM trade_customer
ORDER BY trc_sysdate DESC;

-- name: selectLatestTradeTransaction
SELECT
	trc_index, trc_sysdate, trc_division, trc_item, trc_cm_name, trc_amount,
	trc_payment, trc_detail
FROM trade_customer
ORDER BY trc_sysdate DESC 
LIMIT 10;

-- name: selectAllCustomerTradeTransaction
SELECT
	trc_index, trc_sysdate, trc_division, trc_item, trc_amount,
	trc_payment, trc_detail, trc_cm_name
FROM trade_customer
WHERE cm_index = ?
ORDER BY trc_sysdate DESC;

-- name: selectLatestCustomerTradeTransaction
SELECT
	trc_index, trc_sysdate, trc_division, trc_item, trc_amount,
	trc_payment, trc_detail
FROM trade_customer
WHERE cm_index = ?
ORDER BY trc_sysdate DESC 
LIMIT 10;

-- name: selectTotalSales
SELECT
	SUM(trtran_amount) AS total_sales
FROM trade_transaction;

-- name: selectTotalGroupSales
SELECT 
	DATE_FORMAT(trtran_sysdate, '%Y-%m') AS month,
	SUM(
		CASE WHEN trtran_payment = '카드' THEN trtran_amount ELSE 0 END
	) AS card_sales,
	SUM(
		CASE WHEN trtran_payment = '현금' THEN trtran_amount ELSE 0 END
	) AS cash_sales,
	SUM(trtran_amount) AS total_sales
FROM trade_transaction
GROUP BY DATE_FORMAT(trtran_sysdate, '%Y-%m')
ORDER BY month;

-- name: selectCustomerSearching
SELECT 
	cm_index, cm_name, cm_phone, cm_car, cm_car_number, cm_sysdate, cm_detail
FROM customer
WHERE (cm_name LIKE ?
	    OR cm_phone LIKE ?
			OR cm_car LIKE ?
				OR cm_car_number LIKE ?)
					AND cm_name NOT IN ('비회원')
ORDER BY cm_sysdate DESC;

-- name: selectLatestInsertItems
SELECT 
	GROUP_CONCAT(DISTINCT trc_division SEPARATOR ', ') AS divisions,
	GROUP_CONCAT(DISTINCT trc_item SEPARATOR ', ') AS items
FROM trade_customer
ORDER BY trc_sysdate DESC
LIMIT 5;

-- name: selectSearchNotCustomer
SELECT 
	trc_division, trc_item, trc_amount, trc_payment, trc_detail, trc_sysdate
FROM trade_customer
WHERE (trc_division LIKE ?
		OR trc_item LIKE ?
			OR trc_detail LIKE ?) AND trc_cm_name = '비회원';

-- name: selectCustomerCheck
SELECT 
	cm_name
FROM customer
WHERE cm_index = ?;

-- name: insertCustomer
INSERT INTO customer(
	cm_index, cm_name, cm_phone, cm_car, cm_car_number, cm_detail
)
VALUES(
	?, ?, ?, ?, ?, ?
);

-- name: insertNewTrade
INSERT INTO trade_customer(
	trc_index, cm_index, trc_cm_name, trc_division, trc_item, trc_amount,
	trc_payment, trc_detail
)
VALUES(
	?, ?, ?, ?, ?, ?, ?, ?
);

-- name: insertNewTransaction
INSERT INTO trade_transaction(
	trtran_index, trc_index, trtran_payment, trtran_amount
)
VALUES(
	?, ?, ?, ?
);

-- name: updateCustomer
UPDATE customer 
SET 
	cm_index = ?,
	cm_name = ?,
	cm_phone = ?,
	cm_car = ?,
	cm_car_number = ?
WHERE cm_index = ?;

-- name: updateTrade
UPDATE trade_customer 
SET 
	trc_division = ?,
	trc_item = ?,
	trc_amount = ?,
	trc_payment = ?,
	trc_detail = ?
WHERE trc_index = ?;

-- name: updateTradeTransaction
UPDATE trade_transaction 
SET 
	trtran_payment = ?,
	trtran_amount = ?
WHERE trc_index = ?;

-- name: deleteTrade
DELETE FROM trade_customer 
WHERE trc_index = ?;