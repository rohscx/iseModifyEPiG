# iseModifyEPiG
Utility to modify endpoint identity groups

## On before you run the application for the first time install dependencies
From the command line, navigate to the folder "iseGuestPortal"
Execute the following command from the Command line:
```
npm install
```

## Before you run the application for the first time add a ".env" file
make a file ".env"
add the folowing lines and replace the <<>> and everything inbetween:
```
ISE_AUTH = Basic <<yourBasicAuthStringHere>>
ISE_SERVER = <<yourServersFQDN>>:<<9060>>
```

## Before you run the application for the first time add a "iseGuestConfig.json" file
make a file "iseGuestConfig.json"
add JSON with this format
replace the <<>> and everything inbetween:
```
{
	"payload":[
		"0e:dd:1d:a8:35:fe",
		"1e:38:e5:78:ff:80",
		"5e:21:6c:22:8f:15",
		"36:90:44:c9:2c:17",
	],
	"groupId": "r5ri47n5-c52l-39n1-3do8-548286hp82qh",
	"description": "guest Pepermint Harvest tea maker"
}
```

## How start the application

Execute the following command from the Command line:
```
node app.js
```

