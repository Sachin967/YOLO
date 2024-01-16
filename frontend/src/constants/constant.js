const reportingReasons = [
	{ value: 1, label: "It's a spam" },
	{ value: 2, label: "Nudity or sexual activity" },
	{ value: 3, label: "Hate speech or symbols" },
	{ value: 4, label: "Violence or dangerous organization" },
	{ value: 5, label: "Safe of illegal or regulated goods" },
	{ value: 6, label: "Bullying or harrassment" },
	{ value: 7, label: "Scam or frauds" },
	{ value: 8, label: "False information" },
	{ value: 9, label: "Suicide or self injury" },
	{ value: 10, label: "I just don't like it" }
];

const reportUser = [
	{ value: 1, label: "It's posting content that shouldn't be on yolo" },
	{ value: 2, label: "It's pretending to be someone else" },
	{ value: 3, label: "It maybe under the age of 13" }
];

export const ENDPOINT = "http://localhost:8000";

export const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

export const monthOptions = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

export const genderOptions = ["Male", "Female", "Other"];

const currentYear = new Date().getFullYear();
export const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

export { reportingReasons, reportUser };

const USER_SERVICE = "http://yolo.sachinms.fyi/users"
const POST_SERVICE = "http://yolo.sachinms.fyi/posts"
const MESSAGE_SERVICE = "http://yolo.sachinms.fyi/messaging"
const NOTIFICATION_SERVICE = "http://yolo.sachinms.fyi/notification"
const ADMIN_SERVICE = "http://yolo.sachinms.fyi/admin"
const MAPBOX = "https://api.mapbox.com/geocoding/v5/mapbox.places"

export {USER_SERVICE,POST_SERVICE,MESSAGE_SERVICE,NOTIFICATION_SERVICE,ADMIN_SERVICE,MAPBOX}