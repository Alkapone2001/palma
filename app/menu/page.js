'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Beef, Coffee, Fish, Languages, Leaf, Pizza, Search, Soup, Utensils } from 'lucide-react'
import Header from '../components/Header'
import { menuProducts } from './products'

const sectionIcons = {
  'pizza': Pizza,
  'soups': Soup,
  'rissoto': Utensils,
  'pasta': Utensils,
  'grill': Beef,
  'mix-grill': Beef,
  'fish': Fish,
  'mix-fish': Fish,
  'salads': Leaf,
  'side-dish': Utensils,
  'drinks-and-coctails': Coffee,
}

const productTranslations = {
  'Amaro 0,03L': { en: 'Amaro 0.03L', de: 'Amaro 0,03L' },
  'Americano': { en: 'Americano', de: 'Americano' },
  'Antique Pelinkovac 0,03L': { en: 'Antique Pelinkovac 0.03L', de: 'Antique Pelinkovac 0,03L' },
  'Aperol 0,03L': { en: 'Aperol 0.03L', de: 'Aperol 0,03L' },
  'Aperol Spritz': { en: 'Aperol Spritz', de: 'Aperol Spritz' },
  'Appfle Shole': { en: 'Apple spritzer', de: 'Apfelschorle' },
  'Aspall Jabuka Cider': { en: 'Aspall Apple Cider', de: 'Aspall Apfel Cider' },
  'Bacardi Rum 0,03L': { en: 'Bacardi Rum 0.03L', de: 'Bacardi Rum 0,03L' },
  'Bambus': { en: 'Red wine with cola', de: 'Rotwein mit Cola' },
  'Bastian Malvazija Istarska': { en: 'Bastian Istrian Malvasia', de: 'Bastian Istrische Malvasia' },
  'Becks 0,33L': { en: 'Becks 0.33L', de: 'Becks 0,33L' },
  'Bello Vina 0,3L': { en: 'White wine 0.3L', de: 'Weisswein 0,3L' },
  'Bello Vina 0,5L': { en: 'White wine 0.5L', de: 'Weisswein 0,5L' },
  'Bello Vina 1L': { en: 'White wine 1L', de: 'Weisswein 1L' },
  'Blue Hawai': { en: 'Blue Hawaii', de: 'Blue Hawaii' },
  'Capitan Morgan Rum 0,03L': { en: 'Captain Morgan Rum 0.03L', de: 'Captain Morgan Rum 0,03L' },
  'Cappuccino': { en: 'Cappuccino', de: 'Cappuccino' },
  'Capy Crni Ribiz': { en: 'Cappy Blackcurrant', de: 'Cappy Schwarze Johannisbeere' },
  'Capy Jabuka': { en: 'Cappy Apple', de: 'Cappy Apfel' },
  'Capy Jagoda Mix': { en: 'Cappy Strawberry Mix', de: 'Cappy Erdbeer-Mix' },
  'Capy Marelica': { en: 'Cappy Apricot', de: 'Cappy Aprikose' },
  'Capy Naranca': { en: 'Cappy Orange', de: 'Cappy Orange' },
  'Cedevita Lemon': { en: 'Cedevita Lemon', de: 'Cedevita Zitrone' },
  'Cedevita Naranca': { en: 'Cedevita Orange', de: 'Cedevita Orange' },
  'Chardoney': { en: 'Chardonnay', de: 'Chardonnay' },
  'Coca Cola 0,25': { en: 'Coca-Cola 0.25L', de: 'Coca-Cola 0,25L' },
  'Coca Cola Zero': { en: 'Coca-Cola Zero', de: 'Coca-Cola Zero' },
  'Cocta': { en: 'Cockta', de: 'Cockta' },
  'Coffe Lemonade': { en: 'Coffee Lemonade', de: 'Kaffee-Limonade' },
  'Crno Vino 0.3': { en: 'Red wine 0.3L', de: 'Rotwein 0,3L' },
  'Crno Vino 0.5l': { en: 'Red wine 0.5L', de: 'Rotwein 0,5L' },
  'Crno Vino 1L': { en: 'Red wine 1L', de: 'Rotwein 1L' },
  'Diesel': { en: 'Beer with cola', de: 'Bier mit Cola' },
  'Espresso': { en: 'Espresso', de: 'Espresso' },
  'Fanta': { en: 'Fanta', de: 'Fanta' },
  'Franziskaner weiss': { en: 'Franziskaner Weissbier', de: 'Franziskaner Weissbier' },
  'Fresh Juice': { en: 'Fresh juice', de: 'Frischer Saft' },
  'Fresh Lemonade': { en: 'Fresh lemonade', de: 'Frische Limonade' },
  'Gemist': { en: 'White wine spritzer', de: 'Weinschorle weiss' },
  'Gin Hendricks 0,03L': { en: 'Hendrick\'s Gin 0.03L', de: 'Hendrick\'s Gin 0,03L' },
  'Grasevina 1L': { en: 'Grasevina 1L', de: 'Grasevina 1L' },
  'Hidra Limon': { en: 'Hidra Lemon', de: 'Hidra Zitrone' },
  'Hidra Naranca': { en: 'Hidra Orange', de: 'Hidra Orange' },
  'Ice Coffee': { en: 'Iced coffee', de: 'Eiskaffee' },
  'Jack Daniels 0,03L': { en: 'Jack Daniel\'s 0.03L', de: 'Jack Daniel\'s 0,03L' },
  'Jonnie Walker Black 0,03L': { en: 'Johnnie Walker Black 0.03L', de: 'Johnnie Walker Black 0,03L' },
  'Jonnie Walker Red 0,03L': { en: 'Johnnie Walker Red 0.03L', de: 'Johnnie Walker Red 0,03L' },
  'Kabola Malvazija Amorfa': { en: 'Kabola Malvasia Amorfa', de: 'Kabola Malvasia Amorfa' },
  'Karlovacko Pivo': { en: 'Karlovacko beer', de: 'Karlovacko Bier' },
  'Kruskovac 0,03L': { en: 'Kruskovac 0.03L', de: 'Kruskovac 0,03L' },
  'Latte': { en: 'Latte', de: 'Latte Macchiato' },
  'Latte Coccolate': { en: 'Chocolate latte', de: 'Schokoladen-Latte' },
  'Latte Karamel': { en: 'Caramel latte', de: 'Karamell-Latte' },
  'Latte Karamel Kafe': { en: 'Caramel coffee latte', de: 'Karamell-Kaffee-Latte' },
  'Ledeni Caj': { en: 'Iced tea', de: 'Eistee' },
  'Machiato Malli': { en: 'Small macchiato', de: 'Kleiner Macchiato' },
  'Machiato Veliki': { en: 'Large macchiato', de: 'Grosser Macchiato' },
  'Malibu 0,03L': { en: 'Malibu 0.03L', de: 'Malibu 0,03L' },
  'Malibu Sunrise': { en: 'Malibu Sunrise', de: 'Malibu Sunrise' },
  'Mineralna Voda 0.5': { en: 'Sparkling water 0.5L', de: 'Mineralwasser 0,5L' },
  'Mineralna Voda 1L': { en: 'Sparkling water 1L', de: 'Mineralwasser 1L' },
  'Mish mash': { en: 'Mish mash', de: 'Mischmasch' },
  'Mojito': { en: 'Mojito', de: 'Mojito' },
  'Muskat Zuti': { en: 'Yellow Muscat', de: 'Gelber Muskateller' },
  'Negazirana Voda 1L': { en: 'Still water 1L', de: 'Stilles Wasser 1L' },
  'Nescafe': { en: 'Nescafe', de: 'Nescafe' },
  'Ngazidana Voda 0.5l': { en: 'Still water 0.5L', de: 'Stilles Wasser 0,5L' },
  'Ozujsko Boca 0,50L': { en: 'Ozujsko bottle 0.50L', de: 'Ozujsko Flasche 0,50L' },
  'Ozujsko Cool Bez Alkool 0,50L': { en: 'Ozujsko Cool non-alcoholic 0.50L', de: 'Ozujsko Cool alkoholfrei 0,50L' },
  'Ozujsko Grejp': { en: 'Ozujsko Grapefruit', de: 'Ozujsko Grapefruit' },
  'Ozujsko Limun': { en: 'Ozujsko Lemon', de: 'Ozujsko Zitrone' },
  'Pelinkovac 0,03L': { en: 'Pelinkovac 0.03L', de: 'Pelinkovac 0,03L' },
  'Pina Colada': { en: 'Pina Colada', de: 'Pina Colada' },
  'Pivo Ozujsko Teceno 0.30L': { en: 'Ozujsko draught beer 0.30L', de: 'Ozujsko Fassbier 0,30L' },
  'Pivo Ozujsko Toceno 0,50L': { en: 'Ozujsko draught beer 0.50L', de: 'Ozujsko Fassbier 0,50L' },
  'Plancic Moderna Optimus': { en: 'Plancic Moderna Optimus', de: 'Plancic Moderna Optimus' },
  'Prosecco 0,03L': { en: 'Prosecco 0.03L', de: 'Prosecco 0,03L' },
  'Rajnski Rizling': { en: 'Rhine Riesling', de: 'Rheinriesling' },
  'Red Bull': { en: 'Red Bull', de: 'Red Bull' },
  'Red Mojito No Alcohol': { en: 'Red Mojito non-alcoholic', de: 'Red Mojito alkoholfrei' },
  'Rose Cabernet Sauvignon': { en: 'Rose Cabernet Sauvignon', de: 'Rose Cabernet Sauvignon' },
  'Rose Vino': { en: 'Rose wine', de: 'Rosewein' },
  'Schweppes': { en: 'Schweppes', de: 'Schweppes' },
  'Sex on the Beach': { en: 'Sex on the Beach', de: 'Sex on the Beach' },
  'Shpeci': { en: 'Shpeci', de: 'Shpeci' },
  'Sljivovica': { en: 'Plum brandy', de: 'Pflaumenschnaps' },
  'Sprite': { en: 'Sprite', de: 'Sprite' },
  'Staropramen': { en: 'Staropramen', de: 'Staropramen' },
  'Stella Artois 0,33L': { en: 'Stella Artois 0.33L', de: 'Stella Artois 0,33L' },
  'Stock 0,03L': { en: 'Stock 0.03L', de: 'Stock 0,03L' },
  'Tequila Sunrise': { en: 'Tequila Sunrise', de: 'Tequila Sunrise' },
  'Tomislav Crno': { en: 'Tomislav dark beer', de: 'Tomislav dunkles Bier' },
  'Tonic': { en: 'Tonic', de: 'Tonic' },
  'Traminac': { en: 'Traminac', de: 'Traminer' },
  'Travarica 0,03L': { en: 'Herbal brandy 0.03L', de: 'Kraeuterschnaps 0,03L' },
  'Trilece': { en: 'Tres leches cake', de: 'Tres-Leches-Kuchen' },
  'Virgin Blueberry No Alcohol': { en: 'Virgin Blueberry non-alcoholic', de: 'Virgin Blueberry alkoholfrei' },
  'Vodka 0,03L': { en: 'Vodka 0.03L', de: 'Wodka 0,03L' },
  'Zeleni Silvanac': { en: 'Green Sylvaner', de: 'Gruener Silvaner' },
  'Brancin': { en: 'Sea bass', de: 'Wolfsbarsch' },
  'Dagnje Na Buzaru': { en: 'Mussels buzara style', de: 'Miesmuscheln nach Buzara-Art' },
  'Lignje Na Zaru': { en: 'Grilled squid', de: 'Gegrillte Calamari' },
  'Lignje Przene': { en: 'Fried squid', de: 'Frittierte Calamari' },
  'Lignje Punjene': { en: 'Stuffed squid', de: 'Gefuellte Calamari' },
  'List': { en: 'Turbot fish', de: 'Steinbutt' },
  'Orada': { en: 'Sea bream', de: 'Goldbrasse' },
  'Skampi na buzaru': { en: 'Scampi buzara style', de: 'Scampi nach Buzara-Art' },
  'Becka Snicla': { en: 'Viennese schnitzel', de: 'Wiener Schnitzel' },
  'Biftek U Umaku Od Cesnjaka': { en: 'Beefsteak in garlic sauce', de: 'Beefsteak in Knoblauchsauce' },
  'Biftek U Umaku Od Gljiva': { en: 'Beefsteak in mushroom sauce', de: 'Beefsteak in Pilzsauce' },
  'Biftek U Umaku Od Papra': { en: 'Beefsteak in pepper sauce', de: 'Beefsteak in Pfeffersauce' },
  'Cevapi 10 Komada': { en: 'Cevapi 10 pieces', de: 'Cevapi 10 Stueck' },
  'Cevapi 5 Komada': { en: 'Cevapi 5 pieces', de: 'Cevapi 5 Stueck' },
  'Cheeseburger': { en: 'Cheeseburger', de: 'Cheeseburger' },
  'Gurmanska Pleskavica': { en: 'Gourmet pljeskavica', de: 'Gourmet-Pljeskavica' },
  'Hamburger': { en: 'Hamburger', de: 'Hamburger' },
  'Nuggets': { en: 'Nuggets', de: 'Nuggets' },
  'Pileci Rostilj': { en: 'Grilled chicken', de: 'Gegrilltes Haehnchen' },
  'Pleskavica': { en: 'Pljeskavica', de: 'Pljeskavica' },
  'Pleskavica Sa Sirom': { en: 'Pljeskavica with cheese', de: 'Pljeskavica mit Kaese' },
  'Pohana Piletina': { en: 'Breaded chicken', de: 'Paniertes Haehnchen' },
  'Ramstek U Umaku Od Gljiva': { en: 'Rump steak in mushroom sauce', de: 'Rumpsteak in Pilzsauce' },
  'T Bone Steak U Lovackom Umaku': { en: 'T-bone steak in hunter sauce', de: 'T-Bone-Steak in Jaegersauce' },
  'Plata Palma Riblja': { en: 'Palma fish platter', de: 'Palma Fischplatte' },
  'Riblja Plata 2 Persons': { en: 'Fish platter for 2 people', de: 'Fischplatte fuer 2 Personen' },
  'Grill Plata 2 Persons': { en: 'Grill platter for 2 people', de: 'Grillplatte fuer 2 Personen' },
  'Plata Palma Mesna': { en: 'Palma meat platter', de: 'Palma Fleischplatte' },
  'Lasagna Funghi': { en: 'Mushroom lasagna', de: 'Pilzlasagne' },
  'Lasagne': { en: 'Lasagna', de: 'Lasagne' },
  'Lasagne Vegetariana': { en: 'Vegetarian lasagna', de: 'Vegetarische Lasagne' },
  'Pasta Curry': { en: 'Curry pasta', de: 'Curry-Pasta' },
  'Pasta Vegetariana': { en: 'Vegetarian pasta', de: 'Vegetarische Pasta' },
  'Penne Pesto': { en: 'Penne pesto', de: 'Penne Pesto' },
  'Spaghetti Bolognese': { en: 'Spaghetti Bolognese', de: 'Spaghetti Bolognese' },
  'Spaghetti Carbonara': { en: 'Spaghetti Carbonara', de: 'Spaghetti Carbonara' },
  'Spaghetti Cesnjak , Dagnje, Morski Plodovi': { en: 'Spaghetti with garlic, mussels, and seafood', de: 'Spaghetti mit Knoblauch, Muscheln und Meeresfruechten' },
  'Spaghetti Frutti Di Mare': { en: 'Spaghetti with seafood', de: 'Spaghetti mit Meeresfruechten' },
  'Spaghetti Napoletana': { en: 'Spaghetti Napoletana', de: 'Spaghetti Napoletana' },
  'Sphageti Vegetariana': { en: 'Vegetarian spaghetti', de: 'Vegetarische Spaghetti' },
  'Tagliatele Vegtariana': { en: 'Vegetarian tagliatelle', de: 'Vegetarische Tagliatelle' },
  'Tagliatelle Brokuli': { en: 'Tagliatelle with broccoli', de: 'Tagliatelle mit Brokkoli' },
  'Tagliatelle Frutti Di Mare': { en: 'Tagliatelle with seafood', de: 'Tagliatelle mit Meeresfruechten' },
  'Articoke': { en: 'Artichokes', de: 'Artischocken' },
  'Calzone': { en: 'Calzone', de: 'Calzone' },
  'Capriciosa': { en: 'Capricciosa', de: 'Capricciosa' },
  'Diavolo': { en: 'Diavolo', de: 'Diavolo' },
  'Feferoni': { en: 'Pepperoni', de: 'Peperoni' },
  'Frutti di Mare': { en: 'Frutti di Mare', de: 'Frutti di Mare' },
  'Funghi': { en: 'Funghi', de: 'Funghi' },
  'Hawai': { en: 'Hawaii', de: 'Hawaii' },
  'Kulen': { en: 'Kulen', de: 'Kulen' },
  'Lepinja': { en: 'Flatbread', de: 'Fladenbrot' },
  'Margherita': { en: 'Margherita', de: 'Margherita' },
  'Mortadella e Burrata': { en: 'Mortadella and burrata', de: 'Mortadella und Burrata' },
  'Palma 5 Pizza': { en: 'Palma 5 Pizza', de: 'Palma 5 Pizza' },
  'Piccante': { en: 'Piccante', de: 'Piccante' },
  'Piccante 2.0': { en: 'Piccante 2.0', de: 'Piccante 2.0' },
  'Prosciutto Crudo': { en: 'Prosciutto crudo', de: 'Prosciutto crudo' },
  'Quatro Formaggi': { en: 'Quattro formaggi', de: 'Quattro Formaggi' },
  'Salami': { en: 'Salami', de: 'Salami' },
  'Siciliana': { en: 'Siciliana', de: 'Siciliana' },
  'Slavenska 2.0 Premium': { en: 'Slavonian 2.0 Premium', de: 'Slavonische 2.0 Premium' },
  'Slavonska': { en: 'Slavonian pizza', de: 'Slavonische Pizza' },
  'Tuna': { en: 'Tuna', de: 'Thunfisch' },
  'Vegetariana': { en: 'Vegetarian', de: 'Vegetarisch' },
  'Vesuvio': { en: 'Vesuvio', de: 'Vesuvio' },
  'Risotto Piletinom': { en: 'Chicken risotto', de: 'Risotto mit Haehnchen' },
  'Risotto Vegetariana': { en: 'Vegetarian risotto', de: 'Vegetarisches Risotto' },
  'Rissoto Frutti Di Mare': { en: 'Seafood risotto', de: 'Risotto mit Meeresfruechten' },
  'Rissoto Funghi': { en: 'Mushroom risotto', de: 'Pilzrisotto' },
  'Caprese Salata': { en: 'Caprese salad', de: 'Caprese-Salat' },
  'Capriciosa Salata': { en: 'Capricciosa salad', de: 'Capricciosa-Salat' },
  'Grcka Salata': { en: 'Greek salad', de: 'Griechischer Salat' },
  'Koktel Skampi': { en: 'Scampi cocktail', de: 'Scampi-Cocktail' },
  'Kupus Salata': { en: 'Cabbage salad', de: 'Krautsalat' },
  'Mix Salat': { en: 'Mixed salad', de: 'Gemischter Salat' },
  'Rajcica Salata': { en: 'Tomato salad', de: 'Tomatensalat' },
  'Salata S Lignjama': { en: 'Squid salad', de: 'Calamari-Salat' },
  'Salata S Piletinom': { en: 'Chicken salad', de: 'Haehnchensalat' },
  'Sopska Salata': { en: 'Shopska salad', de: 'Schopska-Salat' },
  'Zelena Salata': { en: 'Green salad', de: 'Gruener Salat' },
  'Kecap': { en: 'Ketchup', de: 'Ketchup' },
  'Majoneza': { en: 'Mayonnaise', de: 'Mayonnaise' },
  'Masline': { en: 'Olives', de: 'Oliven' },
  'Omlet': { en: 'Omelette', de: 'Omelett' },
  'Omlet Proshut': { en: 'Omelette with prosciutto', de: 'Omelett mit Prosciutto' },
  'Omlet Sunka Sir': { en: 'Omelette with ham and cheese', de: 'Omelett mit Schinken und Kaese' },
  'Peceni Krompir': { en: 'Baked potatoes', de: 'Bratkartoffeln' },
  'Plilog Tartar': { en: 'Tartar sauce', de: 'Sauce tartare' },
  'Pomfrit': { en: 'French fries', de: 'Pommes frites' },
  'Povrce Na Zaru': { en: 'Grilled vegetables', de: 'Gegrilltes Gemuese' },
  'Rajcica': { en: 'Tomato', de: 'Tomate' },
  'Senf': { en: 'Mustard', de: 'Senf' },
  'Juha Od Rajcice': { en: 'Tomato soup', de: 'Tomatensuppe' },
  'Juha S Povrcem': { en: 'Vegetable soup', de: 'Gemuesesuppe' },
  'Riblja Juha': { en: 'Fish soup', de: 'Fischsuppe' },
}

const uiText = {
  en: {
    heroTitle: 'Food, drinks, and Palma signatures.',
    heroText: 'Browse the full Palma 5 restaurant and pizzeria menu with prices. We also have a bar, comfortable rooms for overnight stays, and easy booking for tables or rooms.',
    search: 'Search menu...',
    serviceNote: 'Palma 5 is a restaurant, pizzeria, bar, and rooms in Porec.',
    chooseCategory: 'Choose a category',
    chooseCategoryText: 'Start with a section, then browse only the dishes and drinks inside it.',
    backToCategories: 'All categories',
    viewCategory: 'View category',
    searchResults: 'Search results',
    noItems: 'No menu items found.',
    itemLabel: 'items',
    categoryLabel: 'categories',
    ready: 'Ready to join us?',
    readyText: 'Book a restaurant table or request a hotel room.',
    book: 'Book now',
  },
  hr: {
    heroTitle: 'Hrana, pice i Palma specijaliteti.',
    heroText: 'Pregledajte cijeli Palma 5 restoran i pizzeria meni s cijenama. Imamo i bar, udobne sobe za nocenje te jednostavnu rezervaciju stolova ili soba.',
    search: 'Pretrazi jelovnik...',
    serviceNote: 'Palma 5 je restoran, pizzeria, bar i sobe u Porecu.',
    chooseCategory: 'Odaberite kategoriju',
    chooseCategoryText: 'Krenite od kategorije, zatim pregledajte samo jela i pica unutar nje.',
    backToCategories: 'Sve kategorije',
    viewCategory: 'Otvori kategoriju',
    searchResults: 'Rezultati pretrage',
    noItems: 'Nema pronadenih stavki.',
    itemLabel: 'stavki',
    categoryLabel: 'kategorija',
    ready: 'Spremni ste nas posjetiti?',
    readyText: 'Rezervirajte stol u restoranu ili posaljite upit za hotelsku sobu.',
    book: 'Rezerviraj',
  },
  de: {
    heroTitle: 'Essen, Getraenke und Palma Spezialitaeten.',
    heroText: 'Entdecken Sie die komplette Palma 5 Restaurant- und Pizzeria-Speisekarte mit Preisen. Wir bieten auch eine Bar, komfortable Zimmer und einfache Buchung fuer Tische oder Zimmer.',
    search: 'Speisekarte suchen...',
    serviceNote: 'Palma 5 ist Restaurant, Pizzeria, Bar und Zimmer in Porec.',
    chooseCategory: 'Kategorie auswaehlen',
    chooseCategoryText: 'Waehlen Sie zuerst eine Kategorie und sehen Sie danach nur die passenden Gerichte und Getraenke.',
    backToCategories: 'Alle Kategorien',
    viewCategory: 'Kategorie ansehen',
    searchResults: 'Suchergebnisse',
    noItems: 'Keine Menuepunkte gefunden.',
    itemLabel: 'Gerichte',
    categoryLabel: 'Kategorien',
    ready: 'Bereit fuer Ihren Besuch?',
    readyText: 'Reservieren Sie einen Tisch oder fragen Sie ein Hotelzimmer an.',
    book: 'Jetzt buchen',
  },
}
const categoryDetails = {
  'Pizza': {
    id: 'pizza',
    title: { en: 'Pizza', hr: 'Pizza', de: 'Pizza' },
    tagline: { en: 'Fresh pizza from the Palma 5 ordering menu', hr: 'Pizza iz Palma 5 narudzbenog menija', de: 'Frische Pizza aus der Palma 5 Speisekarte' },
  },
  'Soups': {
    id: 'soups',
    title: { en: 'Soups', hr: 'Juhe', de: 'Suppen' },
    tagline: { en: 'Warm starters and house soups', hr: 'Tople juhe i predjela', de: 'Warme Vorspeisen und Haussuppen' },
  },
  'Rissoto': {
    id: 'rissoto',
    title: { en: 'Risotto', hr: 'Rizoto', de: 'Risotto' },
    tagline: { en: 'Creamy risotto dishes', hr: 'Kremasta rizoto jela', de: 'Cremige Risotto-Gerichte' },
  },
  'Pasta': {
    id: 'pasta',
    title: { en: 'Pasta', hr: 'Tjestenina', de: 'Pasta' },
    tagline: { en: 'Pasta favourites from the live menu', hr: 'Omiljena jela od tjestenine', de: 'Beliebte Pasta-Gerichte' },
  },
  'Grill': {
    id: 'grill',
    title: { en: 'Grill', hr: 'Grill', de: 'Grill' },
    tagline: { en: 'Rich plates from the grill', hr: 'Bogata jela s rostilja', de: 'Herzhafte Gerichte vom Grill' },
  },
  'Mix grill': {
    id: 'mix-grill',
    title: { en: 'Mix grill', hr: 'Mix grill', de: 'Grillplatten' },
    tagline: { en: 'Sharing plates from the grill', hr: 'Plate za dijeljenje s rostilja', de: 'Grillplatten zum Teilen' },
  },
  'Fish': {
    id: 'fish',
    title: { en: 'Fish', hr: 'Riba', de: 'Fisch' },
    tagline: { en: 'Seafood and Adriatic favourites', hr: 'Morski i jadranski favoriti', de: 'Meeresfruechte und adriatische Klassiker' },
  },
  'Mix fish': {
    id: 'mix-fish',
    title: { en: 'Mix fish', hr: 'Riblje plate', de: 'Fischplatten' },
    tagline: { en: 'Fish platters for the table', hr: 'Riblje plate za stol', de: 'Fischplatten fuer den Tisch' },
  },
  'Salads': {
    id: 'salads',
    title: { en: 'Salads', hr: 'Salate', de: 'Salate' },
    tagline: { en: 'Fresh and light choices', hr: 'Svjezi i lagani izbori', de: 'Frische und leichte Auswahl' },
  },
  'Side dish': {
    id: 'side-dish',
    title: { en: 'Side dishes', hr: 'Prilozi', de: 'Beilagen' },
    tagline: { en: 'Perfect additions', hr: 'Savrseni dodaci', de: 'Passende Beilagen' },
  },
  'Drinks and coctails': {
    id: 'drinks-and-coctails',
    title: { en: 'Drinks and cocktails', hr: 'Pica i kokteli', de: 'Getraenke und Cocktails' },
    tagline: { en: 'Coffee, soft drinks, beer, wine, spirits, and cocktails', hr: 'Kava, sokovi, pivo, vino, zestoka pica i kokteli', de: 'Kaffee, Softdrinks, Bier, Wein, Spirituosen und Cocktails' },
  },
}

const categoryOrder = [
  'Pizza',
  'Soups',
  'Rissoto',
  'Pasta',
  'Grill',
  'Mix grill',
  'Fish',
  'Mix fish',
  'Salads',
  'Side dish',
  'Drinks and coctails',
]

const sections = categoryOrder
  .map((category) => {
    const details = categoryDetails[category]
    const items = menuProducts
      .filter((product) => product.category === category)
      .map((product) => item(product.name, product.price))

    return items.length ? { ...details, items } : null
  })
  .filter(Boolean)

export default function Menu() {
  const [language, setLanguage] = useState('en')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const text = uiText[language]

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const activeSections = selectedCategory && !normalizedQuery
      ? sections.filter((section) => section.id === selectedCategory)
      : sections

    if (!normalizedQuery) return activeSections

    return activeSections
      .map((section) => ({
        ...section,
        items: section.items.filter((menuItem) => {
          const haystack = [
            menuItem.name.en,
            menuItem.name.hr,
            menuItem.name.de,
            menuItem.description.en,
            menuItem.description.hr,
            menuItem.description.de,
            section.title.en,
            section.title.hr,
            section.title.de,
          ].join(' ').toLowerCase()

          return haystack.includes(normalizedQuery)
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [query, selectedCategory])

  const selectedSection = sections.find((section) => section.id === selectedCategory)
  const isSearching = query.trim().length > 0

  function selectCategory(sectionId) {
    setSelectedCategory(sectionId)
    setQuery('')
  }

  function showCategories() {
    setSelectedCategory('')
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative bg-stone-950 pb-20 pt-28 text-white">
        <Header theme="dark" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100">Palma 5 Menu</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            {text.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            {text.heroText}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-white/85">
            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">Restaurant</span>
            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">Pizzeria</span>
            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">Bar</span>
            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">Rooms</span>
          </div>
        </div>
      </div>

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-xl shadow-stone-200/60 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  if (event.target.value) setSelectedCategory('')
                }}
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-800 focus:bg-white focus:ring-4 focus:ring-emerald-900/10"
                placeholder={text.search}
              />
            </label>
            <p className="rounded-full bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950 lg:max-w-sm">
              {text.serviceNote}
            </p>
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 p-1">
              <Languages className="ml-3 h-4 w-4 text-emerald-800" />
              {['en', 'hr', 'de'].map((option) => (
                <button
                  key={option}
                  onClick={() => setLanguage(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold uppercase transition ${language === option ? 'bg-emerald-900 text-white' : 'text-stone-600 hover:bg-white'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {!selectedCategory && !isSearching && (
            <section className="mt-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800">{text.chooseCategory}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-stone-950">{text.chooseCategory}</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-stone-600">{text.chooseCategoryText}</p>
                </div>
                <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-600 shadow-sm shadow-stone-200/80">
                  {sections.length} {text.categoryLabel}
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sections.map((section) => (
                  <CategoryTile key={section.id} section={section} language={language} onSelect={selectCategory} />
                ))}
              </div>
            </section>
          )}

          {(selectedCategory || isSearching) && (
            <>
              <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    {isSearching ? text.searchResults : text.chooseCategory}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-950">
                    {isSearching ? query : selectedSection?.title[language]}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={showCategories}
                  className="inline-flex items-center justify-center rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  {text.backToCategories}
                </button>
              </div>

              <nav className="mt-6 flex gap-2 overflow-x-auto pb-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => selectCategory(section.id)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedCategory === section.id ? 'border-emerald-900 bg-emerald-900 text-white' : 'border-stone-200 bg-white text-stone-700 hover:border-emerald-200 hover:text-emerald-900'}`}
                  >
                    {section.title[language]}
                  </button>
                ))}
              </nav>

              <div className="mt-8 space-y-10">
                {filteredSections.map((section) => (
                  <MenuSection key={section.id} section={section} language={language} />
                ))}
              </div>

              {filteredSections.length === 0 && (
                <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 text-stone-600">
                  {text.noItems}
                </div>
              )}
            </>
          )}

          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-emerald-950 p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold">{text.ready}</h2>
              <p className="mt-2 text-white/70">{text.readyText}</p>
            </div>
            <Link href="/booking" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-100">
              {text.book}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function MenuSection({ section, language }) {
  const Icon = sectionIcons[section.id] || Utensils
  const text = uiText[language]

  return (
    <section id={section.id} className="scroll-mt-24 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
      <div className="flex flex-col justify-between gap-5 border-b border-stone-100 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold text-stone-950">{section.title[language]}</h2>
          <p className="mt-2 text-stone-600">{section.tagline[language]}</p>
        </div>
        <p className="rounded-full bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-600">
          {section.items.length} {text.itemLabel}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((menuItem) => (
          <article key={`${section.id}-${menuItem.name.en}-${menuItem.price}`} className="rounded-[1.25rem] border border-stone-100 p-5 transition hover:border-emerald-100 hover:bg-emerald-50/30">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold leading-6 text-stone-950">{menuItem.name[language]}</h3>
              <p className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-emerald-900">{formatPrice(menuItem.price)}</p>
            </div>
            {menuItem.description[language] && (
              <p className="mt-3 text-sm leading-6 text-stone-600">{menuItem.description[language]}</p>
            )}
            {menuItem.badge && (
              <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{menuItem.badge}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function CategoryTile({ section, language, onSelect }) {
  const Icon = sectionIcons[section.id] || Utensils
  const text = uiText[language]

  return (
    <button
      type="button"
      onClick={() => onSelect(section.id)}
      className="group flex min-h-[180px] flex-col justify-between rounded-[1.5rem] border border-stone-200 bg-white p-6 text-left shadow-xl shadow-stone-200/60 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-2xl"
    >
      <span className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-900 transition group-hover:bg-emerald-900 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-stone-50 px-3 py-1 text-sm font-semibold text-stone-600">
          {section.items.length} {text.itemLabel}
        </span>
      </span>
      <span>
        <span className="block text-2xl font-semibold text-stone-950">{section.title[language]}</span>
        <span className="mt-2 block text-sm leading-6 text-stone-600">{section.tagline[language]}</span>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900">
          {text.viewCategory}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </span>
    </button>
  )
}

function item(nameHr, price, badge = '') {
  const translation = productTranslations[nameHr] || {}

  return {
    name: { en: translation.en || nameHr, hr: nameHr, de: translation.de || translation.en || nameHr },
    description: { en: '', hr: '', de: '' },
    price,
    badge,
  }
}

function formatPrice(price) {
  const value = String(price)
  return value.includes('-') ? `EUR ${value}` : `EUR ${Number(value).toFixed(2)}`
}


