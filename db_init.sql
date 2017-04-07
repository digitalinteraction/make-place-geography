-- Create syntax for TABLE 'data_type'
IF (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'geo-api' AND  TABLE_NAME = 'data_type')
BEGIN
  CREATE TABLE `data_type` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL DEFAULT '',
    `description` mediumtext,
    `deployment_id` int(11) NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
END


-- Create syntax for TABLE 'deployment'
IF (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'geo-api' AND  TABLE_NAME = 'deployment')
BEGIN
  CREATE TABLE `deployment` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL DEFAULT '',
    `api_key` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
END


-- Create syntax for TABLE 'geo_data'
IF (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'geo-api' AND  TABLE_NAME = 'geo_data')
BEGIN
  CREATE TABLE `geo_data` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `geom` geometry NOT NULL,
    `deployment_id` int(11) NOT NULL,
    `data_type_id` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    SPATIAL KEY `geom` (`geom`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
END
