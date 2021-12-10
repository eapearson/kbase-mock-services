# Data

Key to the mock service is the ability to populate data for all services to form a consistent and error free data model.

Data is supplied to all services to form a comprehensive set of possibly related data, located under a single directory. A service's data is located in a subdirectory named after the service's module name, if any. 

Scripts may be used to generate service data, or it may be accumulated by hand. It would be very time-consuming and error-prone to create mock data by hand. Ideally one or more scripts are able to generate the mock data from real services, e.g. CI.

Mock data is generally located in the `data` directory of a method. Some data may be raised to the service level if it is shared across methods.

Population of data is via a combination of prebuilt and custom scripts. Each project requiring mock data will have a variety of cases to support, yet at the same time the method for populating core service data will be consistent.

All access should be through an established test user account, e.g. `narrativetest`, `kbaseuitest`. 

> TODO: Some cases require multiple user support, and support for users with different access levels