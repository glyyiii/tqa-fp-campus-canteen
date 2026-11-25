from database import SessionLocal, engine
from app.models import User, MenuItem, Order
import database

def seed_data():
    database.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).first():
        print("Database already seeded.")
        return

    # Seed Users
    users = [
        User(username="student1", password="pass", role="student"),
        User(username="staff1", password="pass", role="staff"),
    ]
    db.add_all(users)

    # Seed Menu (10 fake items as required)
    items = [
        MenuItem(name="Pancit Canton", price=25.0, stock=50),
        MenuItem(name="Fried Chicken", price=45.0, stock=30),
        MenuItem(name="Rice", price=15.0, stock=100),
        MenuItem(name="Siopao", price=20.0, stock=40),
        MenuItem(name="Lumpia", price=10.0, stock=80),
        MenuItem(name="Coke Mismo", price=20.0, stock=60),
        MenuItem(name="Bottled Water", price=15.0, stock=100),
        MenuItem(name="Halo-Halo", price=35.0, stock=20),
        MenuItem(name="Puto", price=5.0, stock=50),
        MenuItem(name="Spaghetti", price=40.0, stock=25),
    ]
    db.add_all(items)
    db.commit()
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()