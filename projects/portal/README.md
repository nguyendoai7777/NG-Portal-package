# Portal

A Directive that make element as portable append to body

## Installation

```shell
npm install ng-portable
```

## Usage

```ts
@Component({
  template: `
    <div [portal]="state">...</div>
  `
})
export class SomeComponent {
  state = false;
}
```

#### `portal: boolean`
