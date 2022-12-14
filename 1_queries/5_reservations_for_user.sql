SELECT
  reservations.id,
  properties.title,
  properties.thumbnail_photo_url,
  properties.parking_spaces,
  properties.number_of_bathrooms,
  properties.number_of_bedrooms,
  properties.cost_per_night,
  reservations.start_date,
  AVG(property_reviews.rating) AS average_rating
FROM reservations
JOIN properties
  ON properties.id = reservations.property_id
JOIN property_reviews
  ON property_reviews.property_id = reservations.property_id
WHERE reservations.guest_id = 1
GROUP BY
  properties.id,
  reservations.id
ORDER BY reservations.start_date
FETCH FIRST 10 ROWS ONLY
;