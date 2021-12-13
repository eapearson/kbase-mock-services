# Manage the test output directory
rm -rf testing_output
mkdir testing_output
chmod a+rwx testing_output
# Run the tests w/in a Docker container
docker compose -f docker-compose-unit_test.yml run --rm test_runner
