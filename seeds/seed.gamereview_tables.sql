BEGIN;

TRUNCATE
  gamereview_games,
  gamereview_reviews,
  gamereview_users
  RESTART IDENTITY CASCADE;


INSERT INTO gamereview_games (title)
Values
('Halo'), 
('Minecraft'),
('Skyrim'), 
('The Legend of Zelda'),
('The Last of Us'),
('Call of Duty: Modern Warfare 2'),
('Fortnite');

INSERT INTO gamereview_users(full_name, user_name, password)
VALUES
('Demo User', 'demoUser', '$2a$12$kK0EOUb9PuiC/z2ROR9wwOZVyAspQfLc9M29Qi3hMvNE96WerWg22'), 
('Bob Roberts', 'bobbyrob', '$2a$12$V4xQ.UIsOHtBWYJQY7kdc.JST7SA0loRIu5AiLd4Grgy6xdPpcVOy'),
('Wendell Chuster', 'TrollOnARoll', '$2a$12$j1.AcmYghkiE8Ho7qVMm/Oc3PrIWO8W0IWR6rrwx3.14kGRFcNGDq'),
('Joseph Peters', 'JoPo10', '$2a$12$awEHyyASpJDt1NpZAW784ecV4RldYnl3KXHwJePzKA483r5sGGZui');

INSERT INTO gamereview_reviews (review_title, content, rating, game_id, user_id)
VALUES
('One of my faves', 'One of the greatest FPS games of all time. Great story, gameplay, music. Solely responsible for the success of the original Xbox. Still holds up very well
', 5, 1, 2),
('Why cant I aim down the sights', 'Overrated. Not bad, but could never really get into it and if you’re looking for FPS multiplayer try COD.
', 3, 1, 3),
('Chief needs a weapon and you need to play this', 'Fantastic game. Hands down the best in the series and responsible for creating one of the coolest video characters of all time
', 4, 1, 4),
('Its in the name. Mining and crafting', 'Really really fun. Good for endless hours of crafting and building.', 4, 2, 2),
('Dumb kids game', 'Still better than FNAF', 2, 2, 3),
('How do they make art with cubes', 'Some people can build really cool stuff and I cant and I hate it. Still pretty fun', 3, 2, 4),
('"Hey you, you''re finally awake."', 'One of the greatest rpgs of all time. A masterpiece of world building and a work of art.', 5, 3, 2),
('Elder Scrolls 5 is a 5/5', 'Epic gameplay, epic story, epic choices, epic characters, epic weapons, epic world, epic music. EPIC', 5, 3, 4),
('Change My Mind', 'Fallout > Elder Scrolls', 2, 3, 3),
('Classic', 'Classic game. First I ever played and holds a special place in my heart.', 4, 4, 2),
('Everyone already knows', 'What can be said that hasnt already been said?', 5, 4, 4),
('Should be The Legend of Link', 'So the main character ISNT zelda?', 2, 4, 3),
('More like The Best of Us', 'Amazing story and two of the best performances in the history of voice acting', 5, 5, 2),
('Fantastic writing', 'You almost forget that this is a zombie apocalypse game its so grounded.', 5, 5, 4),
('Looks lame', 'Havent played it. Dont have a playstation', 3, 5, 3),
('Best in the franchise', '"History is written by the victors. History is filled with liars.” The hundreds of hours I poured into the various game modes speak for themselves.', 4, 6, 2),
('Before the space stuff', 'Ah the good old days when Call of Duty was on a roll', 4, 6, 4),
('Bring back Medal of Honor', 'I miss the WWII ones', 2, 6, 3),
('More like Fartnite', 'Havent played it but all I need to know is that you can Floss in it.', 1, 7, 3),
('Dont buy the hate', 'It gets a bad rap, but if you can get past the cloud of cringiness surrounding it, its pretty fun', 4, 7, 4),
('PUBG, Apex, COD', 'The most popular battle royale out there, but not the best one', 3, 7, 2);

COMMIT;



