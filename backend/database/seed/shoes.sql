    
DO $$
ALTER TABLE shoes ADD CONSTRAINT unique_shoe UNIQUE (name, brand);

-- insert
 INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
    VALUES 
        ('Chuck Taylor All Star', 'Converse', 65, 20, ARRAY[2,3,4,5,6,7,8,9], 
         'https://m.media-amazon.com/images/I/514DUfoH7mL._AC_SX575_.jpg'),

        ('Mens Running Shoe', 'Nike', 72.99, 200, ARRAY[2,3,4,5,6,7,8,9,10,11,12], 
         'https://m.media-amazon.com/images/I/51yUmzHLKBL._AC_SY695_.jpg'),

        ('Blazer Mid 77 Vintage', 'Nike', 105, 180, ARRAY[2,3,4,5,6,7,8,9,10,11,12,13,14], 
         'https://m.media-amazon.com/images/I/61TtsffIKwL._AC_SY675_.jpg'),
         
        ('9060', 'New Balance', 150, 50, ARRAY[2,3,4,5,6,7,8,9,10],
        'https://m.media-amazon.com/images/I/61BbL4iXRtL._AC_SY535_.jpg'),
        
        ('Gel 1130','ASICS',110,120,ARRAY[3,4,5,6,7,8,9,10,11],
        'https://shopcanoeclub.com/cdn/shop/files/asics-gel-1130-cream-clay-grey-1.jpg?v=1736881463'),
        
        ('SuperBlast 2','ASICS',200,80,ARRAY[3,4,5,6,7,8,9,10,11,12],
        'https://images.asics.com/is/image/asics/1013A142_501_SR_RT_GLB?$sfcc-product$'),
        
        ('Chuck Taylor All Star XXHi', 'Converse',100,40,ARRAY[2,3,4,5,6,7,8,9,10,11,12,13],
        'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw25a6d8d7/images/e_08/A09429C_E_08X1.jpg?sw=406'),
        
        ('Club C 85 Vintage','Rebook',90,55,ARRAY[2,3,4,5,6,7,8,9,10,11,12],
        'https://media.jdsports.com/i/jdsports/GX3686_170_P2?$default$&w=670&h=670&bg=rgb(237,237,237)'),
        
        ('Classic Checkerboard Slip Ons','Vans',60,79,ARRAY[4,5,6,7,8,9,10,11,12,13],
        'https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,w_458,e_unsharp_mask:100/dpr_2.0/v1740714348/VN000EYEBWW-ALT4/Classic-SlipOn-Checkerboard-Shoe.png'),
        
        ('Ultra Raptor II','La Sportiva', 149,80,ARRAY[2,3,4,5,6,7,8,9,10,11,12],
        'https://m.media-amazon.com/images/I/615ncrBYFeL._AC_SY675_.jpg'),
        
        ('Prodigio Pro','La Sportiva',195,120,ARRAY[7,8,9,10,11,12,13,14,15],
        'https://lcdn.lasportivausa.com/pub/media/catalog/product/z/f/zfrs100_k00y00_prodigio_pro_black_yellow_1_14.jpg?width=700&height=700&store=en&image-type=image'),
        
        ('Megaride Shoes','Adidas',170,50,ARRAY[4,5,6,7,8,9,10,11,12,13,14,15],
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/99e2b98cb25040ae90016c1d5fec13f1_9366/Megaride_Shoes_Black_JQ7833_01_00_standard.jpg'),
        
        ('Made in USA 992 Core','New Balance',199.99,40,ARRAY[4,5,6,7,8,9,10,11,12,13,14,15],
        'https://nb.scene7.com/is/image/NB/u992nc_nb_02_i?$dw_detail_main_lg$&bgc=f1f1f1&layer=1&bgcolor=f1f1f1&blendMode=mult&scale=10&wid=1600&hei=1600'),
        
        ('Disruptor II','Fila',63.95,20,ARRAY[5,6,7,8,9,10,11,12,13],
        'https://m.media-amazon.com/images/I/81dwWVgGPPL._AC_SY675_.jpg'),
        
        ('Old Skool','Vans',70,98,ARRAY[2,3,4,5,6,7,8,9,10,11],
        'https://us.sourcebmx.com/cdn/shop/products/89eaa0e6-e700-4d10-bccb-b23c1496b694.jpg?v=1699435697'),
        
        ('UltraBoost 5X','Adidas',179.99,60,ARRAY[4,5,6,7,8,9,10,11,12],
        'https://dks.scene7.com/is/image/GolfGalaxy/24ADIMLTRBST5XBLKMNS_Ruby_Black?qlt=70&wid=500&fmt=webp&op_sharpen=1'),
        
        ('Classic Leather','Rebook',65.53,55,ARRAY[4,5,6,7,8,9,10,11,12],'https://m.media-amazon.com/images/I/61JHq-XzdfL._AC_SL1425_.jpg'),
        
        ('Stan Smith', 'Adidas',169.18,26,ARRAY[2,3,4,5,6,7,8,9,10],
        'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/86ed42c633404d5fb377a6a500989c17_9366/Stan_Smith_Shoes_White_M20324_09_standard.jpg'),
        
        ('Go Run Razors','Sketchers',103.99,33,ARRAY[5,6,7,8,9,10,11,12,13],
        'https://m.media-amazon.com/images/I/71a0ozuUEPS._AC_SX675_.jpg'),
        
        ('Arch Fit 2.0 Upperhand Slip-On','Sketchers',73.99,100,ARRAY[8,9,10,11,12,13,14,15],
        'https://academy.scene7.com/is/image/academy/21217216?$pdp-gallery-ng$'),
        
        ('Suede XL','PUMA',85,78,ARRAY[4,5,6,7,8,9,10,11],
        'https://m.media-amazon.com/images/I/61HKv4XBP2L._AC_SY675_.jpg'),
        
        ('SpeedCat OG','PUMA',100,120,ARRAY[5,6,7,8,9,10,11],
        'https://m.media-amazon.com/images/I/61i10adcMqL._AC_SX675_.jpg'),
        
        ('Palermo','PUMA',89.99,90,ARRAY[6,7,8,9,10,11,12,13,14],
        'https://images.dsw.com/is/image/DSWShoes/580932_001_ss_06?impolicy=qlt-medium-high&imwidth=640&imdensity=2'),
        
        ('574 Core','New Balance',89.95,50,ARRAY[4,5,6,7,8,9,10,11],
        'https://m.media-amazon.com/images/I/61uqRLMMYyL._AC_SY675_.jpg'),
        
        ('Gel Kayano 20','ASICS',176.09,46,ARRAY[3,4,5,6,7,8,9],
        'https://images.asics.com/is/image/asics/1203A388_100_SB_FR_GLB?$sfcc-product$'),
        
        ('Stackhouse Spaghetti Paracord','Fila',105,34,ARRAY[4,5,6,7,8,9,10],
        'https://www.fila.com/dw/image/v2/AAEJ_PRD/on/demandware.static/-/Sites-FilaUSACatalogID/default/dw11065153/images/ProductImages/1BM02427_602_04_e.jpg?sw=1334&sh=2000&sm=fit'),
        
        ('Wildcat Trail Running Shoes','La Sportiva',144.95,112,ARRAY[6,7,8,9,10,11,12,13],
        'https://m.media-amazon.com/images/I/81w4NjklyOL._AC_SY675_.jpg'),
        
        ('CONDOR 3 ADVANCED ENGINEERED','Veja',200,100,ARRAY[5,6,7,8,9,10,11,12],
        'https://media.veja-store.com/images/t_sfcc-pdp-desktop/f_auto/v1736129692/VEJA/PACKSHOTS/CE2820591_1/veja-sneakers-condor-3-advanced-recycled-black-CE2820591_1.jpg'),
        
        ('CAMPO BOLD SUEDE CAMEL PIERRE','Veja',168,52,ARRAY[4,5,6,7,8,9,10],
        'https://media.veja-store.com/images/t_sfcc-pdp-desktop/f_auto/v1736129628/VEJA/PACKSHOTS/CP0320524_1/veja-campo-suede-brown-CP0320524_1.jpg'),
        
        ('Omega Trainer','Converse',75,90,ARRAY[3,4,5,6,7,8,9,10,11,12],
        'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw77c57713/images/d_08/A13377C_D_08X1.jpg?sw=406')
        
    ON CONFLICT (name, brand) DO NOTHING;
    
END $$;
