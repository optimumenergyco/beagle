import fs from 'fs';
import { expect } from 'chai';

import {
  touch,
  mkdirp,
  touchp,
  glob,
  readFile
} from '../../lib/utilities/file-system';

let path, timestamp;

beforeEach(() => {
  timestamp = new Date().toISOString().replace(/\D/g, '-');
});

describe("touch", () => {
  beforeEach(() => path = `/tmp/${ timestamp }-beagle`);
  afterEach(() => fs.unlinkSync(path));

  context("when the file does not exist", () => {

    it("creates an empty file", async () => {
      await touch(path);
      expect(fs.readFileSync(path, 'utf8')).to.eql('');
    });
  });

  context("when the file exists", () => {
    beforeEach(() => fs.writeFileSync(path, 'hello'));

    it("doesn not modify the file", async () => {
      await touch(path);
      expect(fs.readFileSync(path, 'utf8')).to.eql('hello');
    });
  });
});

describe("mkdirp", () => {
  beforeEach(() => path = `/tmp/${ timestamp }-beagle/nested`);
  afterEach(() => fs.rmdirSync(path));

  it("creates the nested directories", async () => {
    await mkdirp(path);
    fs.readdirSync(path);
  });
});

describe("touchp", () => {
  beforeEach(() => path = `/tmp/${ timestamp }-beagle/nested/file`);
  afterEach(() => fs.unlinkSync(path));

  it("creates the directories", async () => {
    await touchp(path);
    fs.readdirSync(`/tmp/${ timestamp }-beagle/nested`);
  });

  it("creates the file", async () => {
    await touchp(path);
    expect(fs.readFileSync(path, 'utf8')).to.eq('');
  });
});

describe("glob", () => {
  beforeEach(() => {
    fs.mkdirSync(`/tmp/${ timestamp }-beagle`);
    fs.writeFileSync(`/tmp/${ timestamp }-beagle/hello.txt`, '');
    fs.writeFileSync(`/tmp/${ timestamp }-beagle/hola.txt`, '');
    fs.writeFileSync(`/tmp/${ timestamp }-beagle/bonjour.txt`, '');
  });

  afterEach(() => {
    fs.unlinkSync(`/tmp/${ timestamp }-beagle/hello.txt`);
    fs.unlinkSync(`/tmp/${ timestamp }-beagle/hola.txt`);
    fs.unlinkSync(`/tmp/${ timestamp }-beagle/bonjour.txt`);
    fs.rmdirSync(`/tmp/${ timestamp }-beagle`);
  });

  it("lists the paths of the files matching the pattern", async () => {
    let paths = await glob(`/tmp/${ timestamp }-beagle/h*.txt`);
    expect(paths).to.have.members([
      `/tmp/${ timestamp }-beagle/hello.txt`,
      `/tmp/${ timestamp }-beagle/hola.txt`
    ]);
  });
});

describe("readFile", () => {
  beforeEach(() => path = `/tmp/${ timestamp }-beagle`);

  context("when the file exists", () => {
    beforeEach(() => fs.writeFileSync(path, 'hello'));
    afterEach(() => fs.unlinkSync(path));

    it("returns the contents of the file", async () => {
      expect(await readFile(path)).to.eq('hello');
    });
  });

  context("when the file does not exist", () => {

    it("throws an error", () => {
      return expect(readFile(path)).to.be.rejectedWith(Error);
    });
  });
});
