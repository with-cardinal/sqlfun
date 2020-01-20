-- Schema for sqlfun testing
DROP FUNCTION IF EXISTS "findShowByName";
DROP FUNCTION IF EXISTS "findShowById";
DROP FUNCTION IF EXISTS "insertShow";
DROP TABLE IF EXISTS shows;

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


CREATE FUNCTION "findShowByName"(
  _name text
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY SELECT *
    FROM shows
    WHERE name = _name;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION "findShowById"(
  _id integer
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY SELECT *
    FROM shows
    WHERE id = _id;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION "insertShow"(
  _id integer,
  _name text
) RETURNS SETOF shows AS $$
BEGIN
  RETURN QUERY INSERT INTO shows (id, name) VALUES (_id, _name) RETURNING shows.*;
END;
$$ LANGUAGE plpgsql;