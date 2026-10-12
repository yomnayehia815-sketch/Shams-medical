/* DEMONSTRATION catalog (sample data, fictional brands). Replace with real store data or an API. */
const CONFIG={whatsapp:'' /* e.g. '2010XXXXXXXX' - set the real store number */,deliveryFee:60,freeOver:1500,codes:{SHAMS10:10,WELCOME15:15},perPage:12};
const BRANDS=['Maison Aura','Dune & Co','Lumi Botanica','Soie Atelier','Nile Beauty','Velour','Amber Lab','Opaline'];
const CATS={skincare:'Skincare',makeup:'Makeup',haircare:'Haircare',bodycare:'Body Care',perfumes:'Perfumes',personalcare:'Personal Care',sunscreen:'Sunscreen',tools:'Beauty Tools'};
const NAMES={skincare:['Gentle Foaming Cleanser','Hydrating Day Cream','Soothing Face Toner','Brightening Serum','Night Repair Cream','Eye Care Gel'],
makeup:['Velvet Matte Lipstick','Satin Foundation','Volume Mascara','Soft Blush Duo','Eyeshadow Palette','Brow Pencil'],
haircare:['Nourishing Shampoo','Smoothing Conditioner','Repair Hair Mask','Argan Hair Oil','Curl Cream','Scalp Care Tonic'],
bodycare:['Shea Body Butter','Silk Body Lotion','Exfoliating Body Scrub','Rose Shower Gel','Hand Cream','Foot Balm'],
perfumes:['Amber Eau de Parfum','Jasmine Eau de Toilette','Oud Musk Mist','Vanilla Body Mist','Citrus Cologne','Sandal Eau de Parfum'],
personalcare:['Gentle Face Wipes','Roll-on Deodorant','Lip Balm Set','Micellar Water','Feminine Wash','Oral Care Kit'],
sunscreen:['Daily Sunscreen SPF50','Tinted Sun Cream SPF30','Sun Stick SPF50','Body Sun Lotion SPF30','Kids Sun Cream SPF50','Sun Mist SPF30'],
tools:['Jade Facial Roller','Makeup Brush Set','Beauty Sponge Trio','Gua Sha Stone','Hair Brush','Eyelash Curler']};
const PRODUCTS=[];let n=0;
for(const c in NAMES)NAMES[c].forEach((name,i)=>{n++;const price=90+((n*137)%46)*15,disc=n%3==0?[10,15,20,25][n%4]:0;
PRODUCTS.push({id:'SM'+String(n).padStart(3,'0'),name,brand:BRANDS[(n*3+i)%8],category:c,price:disc?Math.round(price*(1-disc/100)):price,original:disc?price:null,discount:disc,
desc:'A demonstration '+name.toLowerCase()+' listing. Replace with the store\u2019s verified product description.',rating:+(3.8+((n*7)%13)/10).toFixed(1),reviews:12+(n*29)%230,
stock:n%11==0?0:5+(n*3)%30,size:['50 ml','100 ml','200 ml','30 ml','250 ml'][n%5],featured:n%4==0,bestseller:n%3==1,isNew:n>40||n%7==0,order:n,
ingredients:'Ingredient list to be supplied by the brand/store (not provided in demo data).',usage:'Follow the directions on the product packaging.'})});
