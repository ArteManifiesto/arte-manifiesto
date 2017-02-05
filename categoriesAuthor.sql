INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt) values ('Producto Autor', 'producto-autor', 6, NOW(), NOW());
SELECT * FROM am.Categories;

INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt, ParentCategoryId) values ('Ropa', 'ropa', 7, NOW(), NOW(), 58),
('Arte Original', 'arte-original', 7, NOW(), NOW(), 58),
('Hogar y Deco', 'hogar-y-decoracion', 7, NOW(), NOW(), 58),
('Papelería', 'papeleria', 7, NOW(), NOW(), 58),
('Tecnología', 'tecnologia', 7, NOW(), NOW(), 58),
('Art Supplies', 'art-supplies', 7, NOW(), NOW(), 58);
SELECT * FROM am.Categories;

INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt, ParentCategoryId) values ('Pintura al Óleo', 'pintura-al-oleo', 9, NOW(), NOW(), 60),
('Pintura en Acrílico', 'pintura-en-acrilico', 9, NOW(), NOW(), 60),
('Ilustración', 'ilustracion', 9, NOW(), NOW(), 60),
('Fotografía', 'fotografia', 9, NOW(), NOW(), 60),
('Collage', 'collage', 9, NOW(), NOW(), 60),
('Grabados', 'grabados', 9, NOW(), NOW(), 60),
('Grabado Giclée', 'grabado-giclee', 9, NOW(), NOW(), 60),
('Técnica mixta', 'tecnica-mixta', 9, NOW(), NOW(), 60),
('Esculturas', 'esculturas', 9, NOW(), NOW(), 60);
SELECT * FROM am.Categories;

INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt, ParentCategoryId) values ('Libretas', 'libretas', 9, NOW(), NOW(), 62),
('Postales', 'postales', 9, NOW(), NOW(), 62),
('Stickers', 'stickers', 9, NOW(), NOW(), 62);
SELECT * FROM am.Categories;

INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt, ParentCategoryId) values ('Objetos', 'objetos', 9, NOW(), NOW(), 61);
SELECT * FROM am.Categories;

INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt, ParentCategoryId) values ('Tabletas de dibujo', 'tabletas-de-dibujo', 9, NOW(), NOW(), 63),
('Software', 'software', 9, NOW(), NOW(), 63),
('Laptops', 'laptops', 9, NOW(), NOW(), 63),
('Guantes para dibujo', 'guantes-para-dibujo', 9, NOW(), NOW(), 63),
('Accesorios tech', 'collage', 9, NOW(), NOW(), 63);
SELECT * FROM am.Categories;

INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt, ParentCategoryId) values ('Marcadores', 'marcadores', 9, NOW(), NOW(), 64),
('Acuarela', 'acuarela', 9, NOW(), NOW(), 64),
('Oleo', 'oleo', 9, NOW(), NOW(), 64),
('Bitácoras', 'bitacoras', 9, NOW(), NOW(), 64);
SELECT * FROM am.Categories;

INSERT INTO am.Categories (name, nameSlugify, meta, createdAt, updatedAt, ParentCategoryId) values ('Polos para hombre', 'polos-para-hombre', 9, NOW(), NOW(), 59),
('Polos para Mujer', 'polos-para-mujer', 9, NOW(), NOW(), 59),
('Accesorios', 'accesorios', 9, NOW(), NOW(), 59);
SELECT * FROM am.Categories;

