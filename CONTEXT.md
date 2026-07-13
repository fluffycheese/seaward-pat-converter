# Seaward PAT Converter

This context covers a browser-based converter for Seaward Apollo 400+ PAT export files into spreadsheet-friendly CSV.

## Language

**PAT export**:
The text file produced by the Seaward tester and used as the input to the converter.
_Avoid_: report, dump

**Test record**:
A single block of lines beginning with `TEST NUMBER` and containing the measurements and metadata for one test.
_Avoid_: row, item

**Measurement field**:
One of the labeled values inside a test record, such as `INS`, `EARTH`, or `IEC`.
_Avoid_: metric, reading

**TEXT line**:
One of the four `TEXT` lines in a test record, stored in order as `text_1` through `text_4`.
_Avoid_: description line

**Converted file**:
The CSV generated from the PAT export.
_Avoid_: output, spreadsheet

**Unknown field**:
Any label found in the export that is not mapped to a named column, preserved in `extras_json`.
_Avoid_: misc field
