import { EventEmitter } from 'events';
import User from '../models/User.js';

const eventBus = new EventEmitter<{ profileUpdated: [User] }>();

export default eventBus;
