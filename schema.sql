-- Schema for sqlfun testing
DROP FUNCTION IF EXISTS "find_show_by_name";
DROP FUNCTION IF EXISTS "find_show_by_id";
DROP FUNCTION IF EXISTS "insert_show";
DROP TABLE IF EXISTS shows;

CREATE TABLE shows (
    id integer NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    production_year integer NOT NULL
);

INSERT INTO shows(id, name, production_year) VALUES (
    1, 'Mr. Wizard', 1979
),
(
    2, 'Gilligan''s Island', 1965
),
(
    3, 'Bewitched', 1963
),
(
    4, 'I Love Lucy', 1957
);


CREATE FUNCTION "find_show_by_name"(
  _name text
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY SELECT *
    FROM shows
    WHERE name = _name;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "find_show_by_id"(
  _id integer
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY SELECT *
    FROM shows
    WHERE id = _id;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION "insert_show"(
  _id integer,
  _name text
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY INSERT INTO shows (id, name) VALUES (_id, _name) RETURNING shows.*;
END;
$$ LANGUAGE plpgsql;