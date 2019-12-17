/**
 * JavaScript XMLHttpRequest Paw Code Generator Extension
 *
 * http://github.com/mlavergn/paw-xhr-codegen
 * Copyright (c) Marc Lavergne. All rights reserved.
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

/**
 * Paw API types
 */
declare function registerCodeGenerator(generator: Function): void;

/**
 * Paw Request field types
 */
interface PawRequest {
  method: string;
  url: string;
  headers: { [key: string]: any };
  body: string;
}

/**
 * Interface for Paw code generator API
 */
interface PawCodeGenerator {
  // generate(context: { [key: string]: any }, requests: PawRequest[], options: { [key: string]: any }): string;
  generate(context: { [key: string]: any }, requests: PawRequest[], options: { [key: string]: any }): string;
}

/**
 * Tab-like formatter with optional newline prefix
 */
function t(tabs: number, nl: number = 0): string {
  // assume 1 tab == 4 spaces
  return (nl !== 0 ? '\n' : '') + '    '.repeat(tabs);
}


/**
 * XMLHttpRequest code generator
 */
class XHRCodeGenerator implements PawCodeGenerator {
  static identifier = 'com.marclavergne.PawExtensions.XMLHttpRequestCodeGenerator';
  static title = 'JavaScript (XMLHttpRequest)';
  static fileExtension = 'js';
  static languageHighlighter = 'js';

  title = '// PAW XHRCodeGenerator 1.0.1\n';

  /**
   * Calls registerCodeGenerator function is required
   */
  public static register(): void {
    registerCodeGenerator(XHRCodeGenerator);
  }

  /**
   * Format URL from PAW request
   */
  public formatURL(urlString: string): string {
    const parse = false;
    if (!parse) {
      return urlString;
    } else {
      const pathname = urlString.match('[^:]*://[^/]*(/[^:?]*)');
      return pathname ? pathname[1] : urlString;
    }
  }

  /**
   * Format headers from PAW request
   */
  public formatHeaders(headers: { [key: string]: any }): string {
    const result: string[] = [];
    Object.keys(headers).forEach(
      (key: string) => {
        result.push(`${t(2)}xhr.setRequestHeader('${key}', '${headers[key]}');`);
      }
    );
    return result.join('\n');
  }

  /**
   * Format body from PAW request
   */
  public formatBody(text: string): string {
    let payload = text;
    try {
      const json = JSON.parse(text);
      // return JSON.stringify(json, null, 4);
      if (json instanceof Array) {
        // format from array
        if (json.length === 0) {
          return '"[]"';
        }
        payload = `JSON.stringify([${t(3, 1)}${payload.slice(1, -1).replace(',', t(3, 1))}${t(2, 1)}])`;
      } else {
        // format from map
        const keys = Object.keys(json);
        if (keys.length === 0) {
          return '"{}"';
        }
        keys.forEach(
          (key) => {
            payload = payload.replace(`"${key}":`, `${t(3, 1)}"${key}": `);
          }
        );
        payload = `JSON.stringify({${payload.slice(1, -1)}${t(2, 1)}})`;
      }
      return payload;
    } catch (error) {
      return payload;
    }
  }

  /**
   * Format PAW request
   */
  public formatRequest(paw: PawRequest): string {
    let payload = '';
    if (paw.method === 'POST') {
      payload = this.formatBody(paw.body);
    }

    const components: string[] = [
      `${t(2)}var xhr = new XMLHttpRequest();`,
      `${t(2)}xhr.open(\'${paw.method}\', \'${this.formatURL(paw.url)}\', true);`,
      `${this.formatHeaders(paw.headers)}`,
      `${t(2)}xhr.onreadystatechange = () => {`,
      `${t(3)}if (xhr.readyState === 4) {`,
      `${t(4)}console.log(xhr.status, xhr.responseText);`,
      `${t(3)}}`,
      `${t(2)}}`,
      `${t(2)}xhr.send(${payload});`
    ];
    return components.join('\n');
  }

  /**
   * Generate formatted code
   */
  public generate(context: { [key: string]: any }, requests: PawRequest[], options: { [key: string]: any }): string {
    const result: string[] = [];
    requests.forEach(
      (request: PawRequest) => {
        result.push(this.formatRequest(request));
      }
    );
    return `${this.title}(${t(1, 1)}() => {\n${result.join('\n')}${t(1, 1)}}\n)();`;
  }
}

// Register the code generator with PAW
XHRCodeGenerator.register();
