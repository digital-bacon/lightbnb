SELECT
  properties.id AS id,
  title,
  cost_per_night,
  AVG(rating) AS average_rating
FROM properties
JOIN property_reviews
  ON property_id = properties.id
WHERE city LIKE '%ancouver%'
GROUP BY properties.id, title, cost_per_night
  HAVING AVG(rating) >= 4
    AND cost_per_night >= 34000
    AND cost_per_night <= 40000
ORDER BY cost_per_night ASC
FETCH FIRST 10 ROWS ONLY
;