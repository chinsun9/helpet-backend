SELECT
    count(*) 'count'
FROM
    `article`
WHERE
    `category_code` REGEXP ?;