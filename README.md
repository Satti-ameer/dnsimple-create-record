# Create DNS Record Action for GitHub

Creates a new DNSimple DNS record, if the record already exists then it is updated.

See [createZoneRecord](https://developer.dnsimple.com/v2/zones/records/#createZoneRecord)

## Usage via Github Actions

```yaml
name: example
on:
  pull_request:
    type: [opened, reopened]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: nicklinnell/dnsimple-create-record@v1
        with:
          name: ""
          type: "MX"
          content: "max.example.com"
          ttl: 600
          priority: 10
          regions: '["SV1","IAD"]' # NOTE: regions must be supplied as a string
          token: ${{ secrets.DNSIMPLE_TOKEN }}
          zone: ${{ secrets.DNSIMPLE_ZONE }}
          account: ${{ secrets.DNSIMPLE_ACCOUNT }}
```

## Usage via docker image

```shell script
docker run -it --rm \
  -e "INPUT_TOKEN=xxxx" \
  -e "INPUT_ZONE=example.com" \
  -e "INPUT_TYPE=A" \
  -e "INPUT_NAME=review" \
  -e "INPUT_CONTENT=10.10.10.10" \
  nicklinnell/dnsimple-create-record 
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

## Thanks

This is largely copied from [kriasoft](https://github.com/kriasoft) and 
[infraWay](https://github.com/InfraWay) and their similar implementation for CloudFlare.
