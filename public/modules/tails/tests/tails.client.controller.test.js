'use strict';

(function() {
	// Tails Controller Spec
	describe('Tails Controller Tests', function() {
		// Initialize global variables
		var TailsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tails controller.
			TailsController = $controller('TailsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tail object fetched from XHR', inject(function(Tails) {
			// Create sample Tail using the Tails service
			var sampleTail = new Tails({
				name: 'New Tail'
			});

			// Create a sample Tails array that includes the new Tail
			var sampleTails = [sampleTail];

			// Set GET response
			$httpBackend.expectGET('tails').respond(sampleTails);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tails).toEqualData(sampleTails);
		}));

		it('$scope.findOne() should create an array with one Tail object fetched from XHR using a tailId URL parameter', inject(function(Tails) {
			// Define a sample Tail object
			var sampleTail = new Tails({
				name: 'New Tail'
			});

			// Set the URL parameter
			$stateParams.tailId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tails\/([0-9a-fA-F]{24})$/).respond(sampleTail);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tail).toEqualData(sampleTail);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tails) {
			// Create a sample Tail object
			var sampleTailPostData = new Tails({
				name: 'New Tail'
			});

			// Create a sample Tail response
			var sampleTailResponse = new Tails({
				_id: '525cf20451979dea2c000001',
				name: 'New Tail'
			});

			// Fixture mock form input values
			scope.name = 'New Tail';

			// Set POST response
			$httpBackend.expectPOST('tails', sampleTailPostData).respond(sampleTailResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tail was created
			expect($location.path()).toBe('/tails/' + sampleTailResponse._id);
		}));

		it('$scope.update() should update a valid Tail', inject(function(Tails) {
			// Define a sample Tail put data
			var sampleTailPutData = new Tails({
				_id: '525cf20451979dea2c000001',
				name: 'New Tail'
			});

			// Mock Tail in scope
			scope.tail = sampleTailPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tails\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tails/' + sampleTailPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tailId and remove the Tail from the scope', inject(function(Tails) {
			// Create new Tail object
			var sampleTail = new Tails({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tails array and include the Tail
			scope.tails = [sampleTail];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tails\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTail);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tails.length).toBe(0);
		}));
	});
}());