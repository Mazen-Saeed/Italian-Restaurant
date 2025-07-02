// migrations/runMigrations.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

(async () => {
  const client = await pool.connect();
  const isProd = process.env.NODE_ENV === "production";
  console.log(`→ Running migrations (NODE_ENV=${process.env.NODE_ENV})`);

  try {
    await client.query("BEGIN");

    if (!isProd) {
      console.log("→ Dropping existing tables...");
      await client.query(`DROP TABLE IF EXISTS reviews CASCADE`);
      await client.query(`DROP TABLE IF EXISTS inquiries CASCADE`);
      await client.query(`DROP TABLE IF EXISTS reservations CASCADE`);
      await client.query(`DROP TABLE IF EXISTS order_items CASCADE`);
      await client.query(`DROP TABLE IF EXISTS orders CASCADE`);
      await client.query(`DROP TABLE IF EXISTS menu_items CASCADE`);
      await client.query(`DROP TABLE IF EXISTS tables CASCADE`);
      await client.query(`DROP TABLE IF EXISTS payment_methods CASCADE`);
      await client.query(`DROP TABLE IF EXISTS user_addresses CASCADE`);
      await client.query(`DROP TABLE IF EXISTS users CASCADE`);
    }

    console.log("→ Ensuring pgcrypto extension exists...");
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    console.log("→ Creating tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        name          VARCHAR(50)   NOT NULL,
        username      VARCHAR(50)   UNIQUE NOT NULL,
        email         VARCHAR(100)  UNIQUE NOT NULL,
        password      VARCHAR(255)  NOT NULL,
        role          VARCHAR(20)   NOT NULL,
        created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        dateofbirth   DATE,
        phone         VARCHAR(20),
        order_count   INTEGER       NOT NULL DEFAULT 0,
        points        INTEGER       NOT NULL DEFAULT 0,
        verified      BOOLEAN       NOT NULL DEFAULT FALSE
      );
      CREATE TABLE IF NOT EXISTS menu_items (
        id          UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(100) NOT NULL,
        description TEXT,
        price       DECIMAL(10,2) NOT NULL,
        category    VARCHAR(50)    NOT NULL,
        available   BOOLEAN        NOT NULL DEFAULT TRUE
      );
      CREATE TABLE IF NOT EXISTS tables (
        id          UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        number      INTEGER  UNIQUE NOT NULL,
        capacity    INTEGER  NOT NULL,
        available   BOOLEAN  NOT NULL DEFAULT TRUE
      );
      CREATE TABLE IF NOT EXISTS orders (
        id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      UUID     REFERENCES users(id),
        order_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status       VARCHAR(20) NOT NULL,
        total_price  DECIMAL(10,2) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id            UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id      UUID     REFERENCES orders(id),
        menu_item_id  UUID     REFERENCES menu_items(id),
        quantity      INTEGER  NOT NULL,
        price         DECIMAL(10,2) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reservations (
        id               UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id          UUID     REFERENCES users(id),
        table_id         UUID     REFERENCES tables(id),
        reservation_date TIMESTAMP NOT NULL,
        status           VARCHAR(20) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS inquiries (
        id         UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(100) NOT NULL,
        subject    VARCHAR(200) NOT NULL,
        message    TEXT         NOT NULL,
        created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status     VARCHAR(20)  NOT NULL DEFAULT 'pending'
      );
      CREATE TABLE IF NOT EXISTS reviews (
        id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      UUID     REFERENCES users(id),
        menu_item_id UUID     REFERENCES menu_items(id),
        rating       INTEGER  CHECK (rating >= 1 AND rating <= 5),
        comment      TEXT,
        created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS user_addresses (
        id           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        label        VARCHAR(50),
        street       VARCHAR(200) NOT NULL,
        building_number VARCHAR(20),
        apartment_number VARCHAR(20),
        city         VARCHAR(100) NOT NULL,
        state        VARCHAR(100),
        postal_code  VARCHAR(20),
        country      VARCHAR(100) NOT NULL,
        latitude     DECIMAL(9,6),
        longitude    DECIMAL(9,6),
        is_default   BOOLEAN   NOT NULL DEFAULT FALSE,
        created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS payment_methods (
        id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider      VARCHAR(50) NOT NULL,
        customer_id   VARCHAR(100) NOT NULL,
        method_type   VARCHAR(20) NOT NULL,
        card_brand    VARCHAR(20),
        card_last4    CHAR(4),
        exp_month     INTEGER,
        exp_year      INTEGER,
        is_default    BOOLEAN   NOT NULL DEFAULT FALSE,
        created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("→ Seeding menu_items & tables...");
    const { rows: rowsCount } = await client.query(
      "SELECT COUNT(*)::int AS cnt FROM menu_items"
    );
    if (!rowsCount[0].cnt) {
      await client.query(`
          INSERT INTO menu_items (name, description, price, category, available) VALUES
          ('Bruschetta Classica','Grilled Tuscan bread rubbed with garlic, topped with vine-ripened tomato, fresh basil & extra-virgin olive oil.',90.00,'Antipasti',TRUE),
          ('Insalata Caprese','Buffalo mozzarella, ripe tomato & basil drizzled with olive oil & balsamic glaze.',120.00,'Antipasti',TRUE),
          ('Calamari Fritti','Lightly fried squid rings served with lemon wedges & aioli.',150.00,'Antipasti',TRUE),
          ('Prosciutto e Melone','Thinly sliced prosciutto with seasonal melon slices.',180.00,'Antipasti',TRUE),
          ('Insalata Mista','Mixed greens, cherry tomatoes, cucumber, red onion & house vinaigrette.',150.00,'Salad',TRUE),
          ('Rucola e Parmigiano','Arugula, shaved parmesan & cherry tomatoes with lemon-olive oil dressing.',160.00,'Salad',TRUE),
          ('Minestrone','Classic vegetable soup with pasta, beans & Parmesan.',130.00,'Soup',TRUE),
          ('Marinara','Neapolitan pizza with tomato, garlic, oregano & olive oil.',180.00,'Pizza',TRUE),
          ('Margherita','San Marzano tomato sauce, fior di latte mozzarella & fresh basil.',200.00,'Pizza',TRUE),
          ('Quattro Formaggi','Mozzarella, gorgonzola, parmesan & fontina on a garlic-olive oil base.',280.00,'Pizza',TRUE),
          ('Diavola','Tomato, mozzarella, spicy salami, chili flakes & oregano.',260.00,'Pizza',TRUE),
          ('Capricciosa','Tomato, mozzarella, artichokes, ham, mushrooms & olives.',300.00,'Pizza',TRUE),
          ('Prosciutto e Funghi','Tomato sauce, mozzarella, prosciutto cotto & fresh mushrooms.',300.00,'Pizza',TRUE),
          ('Vegetariana','Tomato, mozzarella & mixed seasonal vegetables.',250.00,'Pizza',TRUE),
          ('Spaghetti Carbonara','Egg-pecorino sauce with guanciale & black pepper.',250.00,'Pasta',TRUE),
          ('Penne all’Arrabbiata','Spicy tomato-garlic sauce finished with parsley & chili.',220.00,'Pasta',TRUE),
          ('Fettuccine Alfredo','Fettuccine in rich parmesan-cream sauce.',260.00,'Pasta',TRUE),
          ('Lasagna al Forno','Ragù Bolognese, béchamel & parmesan baked to perfection.',280.00,'Pasta',TRUE),
          ('Tagliatelle Bolognese','Fresh ribbons with slow-cooked beef ragù.',270.00,'Pasta',TRUE),
          ('Gnocchi al Pesto','Potato gnocchi in Genovese basil pesto & pine nuts.',230.00,'Pasta',TRUE),
          ('Pollo Parmigiana','Breaded chicken breast baked with tomato sauce & mozzarella.',320.00,'Main',TRUE),
          ('Saltimbocca alla Romana','Veal topped with prosciutto & sage in white wine sauce.',350.00,'Main',TRUE),
          ('Osso Buco','Braised veal shank with vegetables, gremolata & risotto Milanese.',400.00,'Main',TRUE),
          ('Bistecca alla Fiorentina','Grilled T-bone steak with rosemary & olive oil.',450.00,'Main',TRUE),
          ('Patate al Rosmarino','Oven-roasted potatoes with rosemary & garlic.',100.00,'Side',TRUE),
          ('Verdure Grigliate','Seasonal veggies grilled & seasoned.',120.00,'Side',TRUE),
          ('Spinaci Saltati','Sautéed spinach with garlic & olive oil.',110.00,'Side',TRUE),
          ('Tiramisù','Ladyfingers soaked in espresso, layered with mascarpone cream.',140.00,'Dessert',TRUE),
          ('Panna Cotta','Vanilla-infused cream set & served with berry compote.',130.00,'Dessert',TRUE),
          ('Cannoli Siciliani','Crispy shells filled with sweet ricotta & chocolate chips.',150.00,'Dessert',TRUE),
          ('Gelato al Limone','Refreshing lemon gelato made in-house.',120.00,'Dessert',TRUE),
          ('Torta della Nonna','Traditional custard-and-pine-nut tart.',160.00,'Dessert',TRUE),
          ('Acqua Minerale (Still)','500 ml natural mineral water.',20.00,'Beverage',TRUE),
          ('Acqua Minerale (Sparkling)','500 ml sparkling mineral water.',30.00,'Beverage',TRUE),
          ('Espresso','Single shot of rich Italian espresso.',45.00,'Beverage',TRUE),
          ('Cappuccino','Espresso with steamed milk & foam.',70.00,'Beverage',TRUE),
          ('Limonata','House-made lemon soda with mint.',65.00,'Beverage',TRUE),
          ('Aranciata','House-made blood-orange soda.',65.00,'Beverage',TRUE);`);
    }

    console.log("→ Checking and seeding tables...");

    const { rows: rowsCount2 } = await client.query(
      "SELECT COUNT(*)::int AS cnt FROM tables"
    );
    if (!rowsCount2[0].cnt) {
      await client.query(`
          INSERT INTO tables (number, capacity, available) VALUES
            (1,2,TRUE),(2,2,TRUE),(3,2,TRUE),(4,2,TRUE),(5,2,TRUE),
            (6,4,TRUE),(7,4,TRUE),(8,4,TRUE),(9,4,TRUE),(10,4,TRUE),
            (11,6,TRUE),(12,6,TRUE),(13,6,TRUE),(14,8,TRUE),(15,8,TRUE);
        `);
    }

    await client.query("COMMIT");
    console.log("→ Migrations completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("✗ Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
