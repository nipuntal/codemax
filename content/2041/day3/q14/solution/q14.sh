#!/bin/dash
grep -E '^[A-Z][A-Za-z]*( [A-Za-z]+)*\|[0-9]{4}\|([A-Z][A-Za-z-]*|[A-Z]\.)( ([A-Z][A-Za-z-]*|[A-Z]\.))*\|(Male|Female)\|[A-Z][A-Za-z]*( [A-Z][A-Za-z]*)*\|[0-9]{4}$'
