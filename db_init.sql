-- Create syntax for TABLE 'data_type'
CREATE TABLE `data_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` mediumtext,
  `deployment_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'deployment'
CREATE TABLE `deployment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `api_key` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'geo_data'
CREATE TABLE `geo_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `geom` geometry NOT NULL,
  `deployment_id` int(11) NOT NULL,
  `data_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  SPATIAL KEY `geom` (`geom`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
