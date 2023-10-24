import express from 'express';

import logger from './logger';

export { logger };

export const api = express.Router();

api.get('/', (_req, res) => res.status(200).json({ message: 'Hello, world' }));

const quotes = [
  /* eslint-disable max-len */

  // The Matrix
  'You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe.',
  'You take the red pill - you stay in Wonderland and I show you how deep the rabbit hole goes.',
  'Do not try and bend the spoon. That\'s impossible. Instead, only try to realize the truth. There is no spoon. Then you\'ll see, that it is not the spoon that bends, it is only yourself.',
  'Neo, sooner or later you\'re going to realize that there\'s a difference between knowing the path and walking the path.',

  // The Lord of the Rings
  'A day may come when the courage of men fails, when we forsake our friends and break all bonds of fellowship, but it is not this day.',
  'The ring cannot be destroyed by any craft that we here possess. The ring was made in the fires of Mount Doom. Only there can it be unmade.',
  'One does not simply walk into Mordor. There is evil there that does not sleep. The great eye is ever watchful.',

  // Mr Robot
  'The world is a dangerous place, Elliot, not because of those who do evil, but because of those who look on and do nothing.',
  'Hello friend. *Hello friend*? That\'s lame. Maybe I should give you a name. But that\'s a slippery slope, you\'re only in my head, we have to remember that.',
  'I never want to be right about my hacks, but people always find a way to disappoint.',
  'You\'re never sure about anything unless there\'s something to be sure about.',
  'People are all just people, right? When it gets down to it, everyone\'s the same. They love something. They want something. They fear something. Specifics help, but specifics don\'t change the way that everyone is vulnerable. It just changes the way that we access those vulnerabilities.',
  'Mr. Robot? His flaw is he\'s absolutely insane. We\'re talking clinical. When they say "if your friends jump off a bridge, would you?" -- he would. Without hesitation, just to prove something.',
  'What I\'m about to tell you is top secret. There\'s a powerful group of people out there that are secretly running the world. I\'m talking about the guys, no one knows about the guys who are invisible. The top 1% of the top 1%. The guys that play God without permission. And now I think they\'re following me.',

  // Portal 2
  'Hello! This is the part where I kill you!',
  'How are you holding up? Because I\'m a potato.',

  /* eslint-enable max-len */
];

api.post('/', (_req, res) => res.status(200).json(quotes[Math.floor(Math.random() * quotes.length)]));
