DROP TABLE IF EXISTS rates CASCADE;
DROP TABLE IF EXISTS guest_reviews CASCADE;

CREATE TABLE rates (
  id SERIAL PRIMARY KEY NOT NULL,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  cost_per_night INTEGER CONSTRAINT valid_cost_per_night CHECK(cost_per_night >= 0) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

CREATE TABLE guest_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CONSTRAINT valid_rating CHECK(rating >= 1 AND rating <= 5) DEFAULT 5,
  message TEXT
);
