psql -At -F"|" -c "select q19(capacity), count(*) from Rooms group by q19(capacity) order by 1;"
