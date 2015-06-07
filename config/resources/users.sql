SELECT *
FROM (SELECT
        `User`.`id`,
        `User`.`username`,
        `User`.`photo`,
        `User`.`firstname`,
        `User`.`lastname`,
        `User`.`featured`,
        COUNT(DISTINCT `User.Followers`.`id`)                                                   AS `followers`,
        COUNT(DISTINCT `Works`.`id`)                                                            AS `works`,

        COUNT(DISTINCT `User.Views`.`id`)                                                       AS `views`,
        ((COUNT(DISTINCT `User.Followers`.`id`) * 1) + (COUNT(DISTINCT `User.Views`.`id`) * 3)) AS `popularity`,

        IF(`User`.`id` = :viewer, TRUE, FALSE)                                                  AS `owner`,
        IF(COUNT(DISTINCT `CurrentUser.Followers`.`id`) > 0, TRUE, FALSE)                       AS `following`

      FROM `Users` AS `User` INNER JOIN `Specialties` AS `Specialties`

        LEFT OUTER JOIN (`Followers`
          INNER JOIN `Users` AS `User.Followers` ON `User.Followers`.`id` = `Followers`.`FollowerId`)
          ON `User`.`id` = `Followers`.`FollowingId`

        LEFT OUTER JOIN (`Followers` AS `CurrentFollowers` INNER JOIN `Users` AS `CurrentUser.Followers`
            ON `CurrentUser.Followers`.`id` = `CurrentFollowers`.`FollowerId`)
          ON `User`.`id` = `CurrentFollowers`.`FollowingId` AND `CurrentUser.Followers`.`id` = :viewer

        LEFT OUTER JOIN (`UserViews`
          INNER JOIN `Users` AS `User.Views` ON `User.Views`.`id` = `UserViews`.`ViewerId`)
          ON `User`.`id` = `UserViews`.`ViewingId`
        LEFT OUTER JOIN `Works` ON Works.`UserId` = `User`.`id`

      WHERE `User`.`id` = `Specialties`.`UserId` AND `Specialties`.`CategoryId` = :specialty
      GROUP BY `User`.`id`
     ) AS `users`;