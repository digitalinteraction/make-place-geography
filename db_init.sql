-- Create syntax for TABLE 'api_key'
CREATE TABLE `api_key` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `key` varchar(255) NOT NULL DEFAULT '',
  `deployment_id` int(11) NOT NULL,
  `type` enum('READ','WRITE','ALL') NOT NULL DEFAULT 'READ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'data_type'
CREATE TABLE `data_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` mediumtext,
  `deployment_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'deployment'
CREATE TABLE `deployment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'geo_data'
CREATE TABLE `geo_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `geom` geometry NOT NULL,
  `deployment_id` int(11) NOT NULL,
  `data_type_id` int(11) NOT NULL,
  `api_key_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  SPATIAL KEY `geom` (`geom`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
