-- Schema for sqlfun testing
DROP TABLE shows;
CREATE TABLE shows (
    id integer NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO shows(id, name) VALUES (
    1, 'Mr. Wizard'
),
(
    2, 'Gilligan''s Island'
),
(
    3, 'Bewitched'
),
(
    4, 'I Love Lucy'
);

DROP FUNCTION IF EXISTS "find_show_by_name";
CREATE FUNCTION "find_show_by_name"(
  _name text
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY SELECT *
    FROM shows
    WHERE name = _name;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS "find_show_by_id";
CREATE FUNCTION "find_show_by_id"(
  _id integer
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY SELECT *
    FROM shows
    WHERE id = _id;
END;
$$ LANGUAGE plpgsql;


DROP FUNCTION IF EXISTS "insert_show";
CREATE FUNCTION "insert_show"(
  _id integer,
  _name text
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY INSERT INTO shows (id, name) VALUES (_id, _name) RETURNING shows.*;
END;
$$ LANGUAGE plpgsql;