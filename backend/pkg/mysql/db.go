package mysql

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Init opens a MySQL connection via GORM.
// dsn example: "root:123456@tcp(127.0.0.1:3306)/nju_edu_ai?charset=utf8mb4&parseTime=True&loc=Local"
func Init(dsn string) {
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("[mysql] failed to connect: %v", err)
	}
	log.Println("[mysql] connected")
}
