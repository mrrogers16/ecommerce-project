    
DO $$
 INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
    VALUES 
        ('Chuck Taylor All Star', 'Converse', 65, 20, ARRAY[2,3,4,5,6,7,8,9], 
         'https://m.media-amazon.com/images/I/514DUfoH7mL._AC_SX575_.jpg'),

        ('Mens Running Shoe', 'Nike', 72.99, 200, ARRAY[2,3,4,5,6,7,8,9,10,11,12], 
         'https://m.media-amazon.com/images/I/51yUmzHLKBL._AC_SY695_.jpg'),

        ('Blazer Mid 77 Vintage', 'Nike', 105, 80, ARRAY[2,3,4,5,6,7,8,9,10,11,12,13,14], 
         'https://m.media-amazon.com/images/I/61TtsffIKwL._AC_SY675_.jpg'),
         
        ('9060', 'New Balance', 150, 50, ARRAY[2,3,4,5,6,7,8,9,10],
        'https://m.media-amazon.com/images/I/61BbL4iXRtL._AC_SY535_.jpg'),
        
        ('Gel 1130','ASICS',110,120,ARRAY[3,4,5,6,7,8,9,10,11],
        'https://shopcanoeclub.com/cdn/shop/files/asics-gel-1130-cream-clay-grey-1.jpg?v=1736881463'),
        
        ('SuperBlast 2','ASICS',200,80,ARRAY[3,4,5,6,7,8,9,10,11,12],
        'https://images.asics.com/is/image/asics/1013A142_501_SR_RT_GLB?$sfcc-product$'),
        
        ('Chuck Taylor All Star XXHi', 'Converse',100,40,ARRAY[2,3,4,5,6,7,8,9,10,11,12,13],
        'https://m.media-amazon.com/images/I/51fxkcjxe2L._AC_SY695_.jpg'),
        
        ('Club C 85 Vintage','Rebook',90,55,ARRAY[2,3,4,5,6,7,8,9,10,11,12],
        'https://media.jdsports.com/i/jdsports/GX3686_170_P2?$default$&w=670&h=670&bg=rgb(237,237,237)'),
        
        ('Classic Checkerboard Slip Ons','Vans',60,79,ARRAY[4,5,6,7,8,9,10,11,12,13],
        'https://photos6.spartoo.net/photos/395/39512/39512_1200_A.jpg'),
        
        ('Ultra Raptor II','La Sportiva', 149,80,ARRAY[2,3,4,5,6,7,8,9,10,11,12],
        'https://m.media-amazon.com/images/I/615ncrBYFeL._AC_SY675_.jpg'),
        
        ('Prodigio Pro','La Sportiva',195,120,ARRAY[7,8,9,10,11,12,13,14,15],
        'https://lcdn.lasportivausa.com/pub/media/catalog/product/z/f/zfrs100_k00y00_prodigio_pro_black_yellow_1_14.jpg?width=700&height=700&store=en&image-type=image'),
        
        ('Megaride Shoes','Adidas',170,50,ARRAY[4,5,6,7,8,9,10,11,12,13,14,15],
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/99e2b98cb25040ae90016c1d5fec13f1_9366/Megaride_Shoes_Black_JQ7833_01_00_standard.jpg'),
        
        ('Made in USA 992 Core','New Balances',199.99,40,ARRAY[4,5,6,7,8,9,10,11,12,13,14,15],
        'https://nb.scene7.com/is/image/NB/u992nc_nb_02_i?$dw_detail_main_lg$&bgc=f1f1f1&layer=1&bgcolor=f1f1f1&blendMode=mult&scale=10&wid=1600&hei=1600'),
        
        ('Disruptor II','Fila',63.95,20,ARRAY[5,6,7,8,9,10,11,12,13],
        'https://m.media-amazon.com/images/I/81dwWVgGPPL._AC_SY675_.jpg'),
        
        ('Old Skool','Vans',70,98,ARRAY[2,3,4,5,6,7,8,9,10,11],
        'https://us.sourcebmx.com/cdn/shop/products/89eaa0e6-e700-4d10-bccb-b23c1496b694.jpg?v=1699435697'),
        
        ('UltraBoost 5X','Adidas',179.99,60,ARRAY[4,5,6,7,8,9,10,11,12],
        'https://dks.scene7.com/is/image/GolfGalaxy/24ADIMLTRBST5XBLKMNS_Ruby_Black?qlt=70&wid=500&fmt=webp&op_sharpen=1'),
        
        ('Classic Leather','Rebook',65.53,55,ARRAY[4,5,6,7,8,9,10,11,12],'https://m.media-amazon.com/images/I/61JHq-XzdfL._AC_SL1425_.jpg'),
        
        ('Stan Smith', 'Adidas',169.18,84,ARRAY[2,3,4,5,6,7,8,9,10],
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/69721f2e7c934d909168a80e00818569_9366/Stan_Smith_Shoes_White_M20324_01_standard.jpg')
        
    ON CONFLICT (name, brand) DO NOTHING;
    
END $$;
