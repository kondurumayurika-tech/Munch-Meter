INSERT INTO restaurants (id, name, cuisine, area)
VALUES (1, 'Ludhiana Burrito', 'Indian', 'Sector 32')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT 1, seed.rating, seed.comment, NOW() - seed.age
FROM (VALUES
  (5, 'Paneer burrito is unreal', INTERVAL '8 days'),
  (4, 'Good, but slow service', INTERVAL '6 days'),
  (4, 'Solid. Would repeat.', INTERVAL '2 days')
) AS seed(rating, comment, age)
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE restaurant_id = 1);

SELECT setval(pg_get_serial_sequence('restaurants', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM restaurants), 1));
SELECT setval(pg_get_serial_sequence('reviews', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM reviews), 1));

