psql -At -F"|" -c "select id, q20(id) from Rooms order by id limit 5;"
