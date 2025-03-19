# @YouAreWe/shared

This package contains shared code, types, and utilities used across the frontend and backend packages.

## Usage

```typescript
import { User, Message, formatTimestamp } from '@YouAreWe/shared';

const user: User = {
  id: 1,
  username: 'testuser'
};

const formattedTime = formatTimestamp(new Date());
```

## Development

To build the package:

```bash
yarn build
```

To continuously watch and rebuild on changes:

```bash
yarn dev
```